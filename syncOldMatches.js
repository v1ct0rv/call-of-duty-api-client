require('dotenv').config()
const API = require('call-of-duty-api')({
  platform: "battle"
})
const util = require('util')
const {
  MongoClient
} = require("mongodb");
const retry = require('async-retry');
const TrackedGamersService = require("./services/trackedGamersService");
const PlayerMatchesService = require("./services/playerMatchesService");
const MatchesService = require("./services/matchesService");
const ConfigService = require('./services/configService');

const syncMatchesJob = async function () {

  console.log(`[${new Date().toISOString()}]: Starting Sync Old Matches Job.`)

  // Create a new MongoClient
  const client = new MongoClient(process.env.MONGO_DB_URI);

  try {
    // Connect the client to the server
    await client.connect();

    // Create the DB if not exists
    const database = client.db('cod-stats');

    const configService = new ConfigService(client, database)
    await configService.init()

    const trackedGamersService = new TrackedGamersService(client, database)
    await trackedGamersService.init()

    const playerMatchesService = new PlayerMatchesService(client, database, API, trackedGamersService)
    await playerMatchesService.init()

    console.time('login')
    const authMode = await configService.get('authentication.mode')
    if (authMode.value == 'username') {
      await API.login((await configService.get('authentication.username')).value, (await configService.get('authentication.password')).value, (
        await configService.get('authentication.2captchaApiKey')).value);
    } else if (authMode.value == 'sso') {
      await API.loginWithSSO((await configService.get('authentication.syncOldMatches.ssoToken')).value); // This will be different than index.js uses to avoid too many requests
    } else {
      throw new Error(`Unknown Authentication Mode ${authMode}`)
    }
    console.timeEnd('login')

    const gamers = await trackedGamersService.getAll()

    for (const gamer of gamers) {
      // force Resync Old Matches
      await retry(
        async (bail, attempt) => {
          console.log(`[${new Date().toISOString()}] Starting syncOldMatches, attepmt '${attempt}'...`)
          await playerMatchesService.syncOldMatches(gamer)
        },
        {
          retries: 2,
          forever: true,
          factor: 2,
          minTimeout: 480000, // 8 minutes
          maxTimeout: 900000, // 15 mins
          onRetry: function(error) {
            console.log(`[${new Date().toISOString()}] An Error ocurred on syncOldMatches, Error: '${error}'...`)
            console.timeEnd(`syncOldMatches`)
          },
        }
      )
    }

    // // console.log(util.inspect(data,{showHidden: false, depth: null, colors: true}));
  } catch (Error) {
    //Handle Exception
    console.error(Error)
    process.exit(1)
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

syncMatchesJob()
