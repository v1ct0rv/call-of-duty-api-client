import { config } from "dotenv";
config();
import API from "call-of-duty-api";
import util from "util";
import { MongoClient } from "mongodb";
import retry from "async-retry";
import TrackedGamersService from "./services/trackedGamersService.js";
import PlayerMatchesService from "./services/playerMatchesService.js";
import MatchesService from "./services/matchesService.js";
import ConfigService from "./services/configService.js";

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

    if(process.env.DEBUG) {
      console.log(`Starting in debug mode...`)
      API.enableDebugMode()
    }

    console.time('login')
    API.login((await configService.get('authentication.ssoToken')).value_alt); // This will be different than index.js uses to avoid too many requests
    console.timeEnd('login')

    const SINGLE_GAMER = process.env.SINGLE_GAMER || false;
    let gamers = []
    if (SINGLE_GAMER === 'true') {
      gamers.push(await trackedGamersService.get(process.env.SINGLE_GAMERTAG, process.env.SINGLE_GAMER_PLATFORM))
    } else {
      gamers = await trackedGamersService.getAllOldMatchesNotSynched()
    }

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
          minTimeout: 300000, // 5 minutes
          maxTimeout: 600000, // 10 mins // 900000, // 15 mins
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
