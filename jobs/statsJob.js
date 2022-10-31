import API from "call-of-duty-api";
import util from "util";
import { MongoClient } from "mongodb";
import TrackedGamersService from "../services/trackedGamersService.js";
import BrStatsService from "../services/brStatsService.js";
import LifetimeStatsService from "../services/lifetimeStatsService.js";
import PlayerMatchesService from "../services/playerMatchesService.js";
import MatchesService from "../services/matchesService.js";
import ConfigService from "../services/configService.js";

const statsJob = async function () {
  console.log(`[${new Date().toISOString()}]: Starting Stats Job.`)

  // Create a new MongoClient
  const client = new MongoClient(process.env.MONGO_DB_URI);

  // TODO temporal fix for stuck requests.
  // delete API.apiAxios.defaults.headers.common.userAgent;

  try {
    // Connect the client to the server
    await client.connect();

    // Create the DB if not exists
    const database = client.db('cod-stats');

    const configService = new ConfigService(client, database)
    await configService.init()

    const trackedGamersService = new TrackedGamersService(client, database)
    await trackedGamersService.init()

    const lifetimeStatsService = new LifetimeStatsService(client, database, API)
    await lifetimeStatsService.init()

    const playerMatchesService = new PlayerMatchesService(client, database, API, trackedGamersService)
    await playerMatchesService.init()

    const brStatsService = new BrStatsService(client, database, API)
    await brStatsService.init()

    const matchesService = new MatchesService(client, database, API, playerMatchesService, configService)
    await matchesService.init()

    if(process.env.DEBUG) {
      console.log(`Starting in debug mode...`)
      API.enableDebugMode()
    }

    console.time('login')
    API.login((await configService.get('authentication.ssoToken')).value);
    console.timeEnd('login')

    const SINGLE_GAMER = process.env.SINGLE_GAMER || false;
    let gamers = []
    if (SINGLE_GAMER === 'true') {
      gamers.push(await trackedGamersService.get(process.env.SINGLE_GAMERTAG, process.env.SINGLE_GAMER_PLATFORM))
    } else {
      gamers = await trackedGamersService.getAll()
    }

    console.time('AllStats')
    for (const gamer of gamers) {
      let gamertag = gamer.gamertag
      let platform = gamer.platform
      let teams = gamer.teams
      let date = getCurrentDateWithoutTime()
      let query = {
        username: gamertag,
        platform: platform,
        date: date
      }
      let options = {
        upsert: true
      }
      console.log(`Getting data for gamertag: '${gamertag}', platform: '${platform}'`)

      try {
        // Skipping lifetimeStatsService we are not using it for now...
        // Lifetime Statistics
        // console.log(`Getting Lifetime Statistics...`)
        // await lifetimeStatsService.add(gamertag, platform, date)
        // await sleep(randomIntFromInterval(500, 1500))

        // Recent Match Details
        console.log(`Getting Recent Match Details...`)
        await playerMatchesService.add(gamertag, platform)
        await sleep(randomIntFromInterval(500, 1500))

        // Battle Royale Statistics.
        console.log(`Getting Battle Royale Statistics...`)
        await brStatsService.add(gamertag, platform, date, teams)
        await sleep(randomIntFromInterval(500, 1500))

        // Update User
        await trackedGamersService.enableGamer(gamertag, platform)
        await sleep(randomIntFromInterval(500, 1500))
      } catch (error) {
        // End all timers
        console.timeEnd(`lifetimeStats ${gamertag}`)
        console.timeEnd(`recentMatchDetails ${gamertag}`)
        console.timeEnd(`brStatistics ${gamertag}`)
        //Handle Exception
        console.log(`Error Getting data for gamertag: '${gamertag}', platform: '${platform}'`)
        console.error(error)
        // await trackedGamersService.disableGamer(gamertag, platform, error);
      }
    }

    // Sync matches
    await matchesService.syncMatches()

    console.timeEnd('AllStats')

    // // console.log(util.inspect(data,{showHidden: false, depth: null, colors: true}));
  } catch (Error) {
    //Handle Exception
    console.error(Error)
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

function getCurrentDateWithoutTime() {
  return getDateWithoutTime(new Date())
}

function getDateWithoutTime(dateTime) {
  var date = new Date(dateTime.getTime())
  date.setHours(0, 0, 0, 0)
  return date
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export default statsJob
