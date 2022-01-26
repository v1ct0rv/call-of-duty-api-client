require('dotenv').config()
const API = require('call-of-duty-api')({
  platform: "battle"
})
const util = require('util')
const {
  MongoClient
} = require("mongodb");
const TrackedGamersService = require("./services/trackedGamersService");
const PlayerMatchesService = require("./services/playerMatchesService");
const MatchesService = require("./services/matchesService");
const ConfigService = require('./services/configService');

const syncMatchesJob = async function () {

  console.log(`[${new Date().toISOString()}]: Starting Sync Matches Job.`)

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

    const matchesService = new MatchesService(client, database, API, playerMatchesService, configService)
    await matchesService.init()

    console.time('login')
    const authMode = await configService.get('authentication.mode')
    if (authMode.value == 'username') {
      await API.login((await configService.get('authentication.username')).value, (await configService.get('authentication.password')).value, (
        await configService.get('authentication.2captchaApiKey')).value);
    } else if (authMode.value == 'sso') {
      await API.loginWithSSO((await configService.get('authentication.ssoToken')).value);
    } else {
      throw new Error(`Unknown Authentication Mode ${authMode}`)
    }
    console.timeEnd('login')

    // force Resync All Matches
    // await playerMatchesService.forceReSyncAllMatches();

    // Sync matches
    await matchesService.syncMatches(true, false)

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
