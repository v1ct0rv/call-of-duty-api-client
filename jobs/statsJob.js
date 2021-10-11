const API = require('call-of-duty-api')({
  platform: "battle"
})
const util = require('util')
const {
  MongoClient
} = require("mongodb");
const TrackedGamersService = require("../services/trackedGamersService");
const BrStatsService = require("../services/brStatsService");
const LifetimeStatsService = require("../services/lifetimeStatsService");
const RecentMatchesService = require("../services/recentMatchesService");
const ConfigService = require('../services/configService');

const statsJob = async function () {
  console.log(`[${new Date().toISOString()}]: Starting Stats Job.`)

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

    const brStatsService = new BrStatsService(client, database, API)
    await brStatsService.init()

    const lifetimeStatsService = new LifetimeStatsService(client, database, API)
    await lifetimeStatsService.init()

    const recentMatchesService = new RecentMatchesService(client, database, API)
    await recentMatchesService.init()

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

    const gamers = await trackedGamersService.getAll()

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
        // Lifetime Statistics
        console.log(`Getting Lifetime Statistics...`)
        await lifetimeStatsService.add(gamertag, platform, date)
        await sleep(500)

        // Recent Match Details
        console.log(`Getting Recent Match Details...`)
        await recentMatchesService.add(gamertag, platform, date)
        await sleep(500)

        // Battle Royale Statistics.
        console.log(`Getting Battle Royale Statistics...`)
        await brStatsService.add(gamertag, platform, date, teams)
        await sleep(500)

        // Update User
        await trackedGamersService.enableGamer(gamertag, platform)
        await sleep(500)
      } catch (error) {
        // End all timers
        console.timeEnd(`lifetimeStats ${gamertag}`)
        console.timeEnd(`recentMatchDetails ${gamertag}`)
        console.timeEnd(`brStatistics ${gamertag}`)
        //Handle Exception
        console.log(`Error Getting data for gamertag: '${gamertag}', platform: '${platform}'`)
        console.error(error)
        await trackedGamersService.disableGamer(gamertag, platform, error);
      }
    }
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

module.exports = statsJob
