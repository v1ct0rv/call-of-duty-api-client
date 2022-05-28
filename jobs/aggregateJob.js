const {
  MongoClient
} = require("mongodb")
const moment = require('moment')

const TrackedGamersService = require("../services/trackedGamersService");
const PlayerMatchesService = require("../services/playerMatchesService")
const RebirthStatsService = require("../services/rebirthStatsService")
const BrStatsService = require("../services/brStatsService");

const aggregateJob = async function () {
  // Create a new MongoClient
  const client = new MongoClient(process.env.MONGO_DB_URI);

  try {
    // Connect the client to the server
    await client.connect();

    // Create the DB if not exists
    const database = client.db('cod-stats')

    const trackedGamersService = new TrackedGamersService(client, database)
    await trackedGamersService.init()

    const playerMatchesService = new PlayerMatchesService(client, database, null, trackedGamersService)
    await playerMatchesService.init()

    const rebirthStatsService = new RebirthStatsService(client, database)
    await rebirthStatsService.init()

    const brStatsService = new BrStatsService(client, database, null)
    await brStatsService.init()

     const gamers = await trackedGamersService.getAll()

    console.time('AggregateStats')
    for (const gamer of gamers) {
      let gamertag = gamer.gamertag
      let platform = gamer.platform
      let teams = gamer.teams
      let date = getCurrentDateWithoutTime()
      console.log(`[${new Date().toISOString()}] Processing (Aggregate) Stats for '${gamertag}' and platform '${platform}'...`)

      // Load current brStatData
      const brStatData = await brStatsService.get(gamertag, platform, date)

      if(brStatData) {
        console.log(`Getting maxKills and longestStreaks in a BR win...`)

        // Update brstats with maxKills and longestStreaks in a BR win.
        const maxBRStats = await playerMatchesService.getMaxBRStats(gamertag, platform)
        brStatData.br.maxKills = maxBRStats.maxKills
        brStatData.br.longestStreak = maxBRStats.longestStreak

        // Set last win data
        console.log(`Getting Last Win data...`)
        console.time(`getLastWin ${gamertag}`)
        const winStats = await playerMatchesService.getLastWinMatch(gamertag, platform)
        console.timeEnd(`getLastWin ${gamertag}`)

        if(winStats && winStats.lastWin) {
          const lastWinDate = moment.unix(winStats.lastWin.utcStartSeconds)
          console.log(`[${new Date().toISOString()}] ${gamertag} last win match id: ${winStats.lastWin.matchID} on ${lastWinDate.utcOffset(-300).format('YYYY-MM-DD hh:mm:ss')}`)
          brStatData.br.lastWin = {
            matchID: winStats.lastWin.matchID,
            date: lastWinDate.toDate(),
            utcStartSeconds: winStats.lastWin.utcStartSeconds,
            utcEndSeconds: winStats.lastWin.utcEndSeconds,
            playerStats: winStats.lastWin.playerStats,
          }

          brStatData.br.maxKillsWin = winStats.maxKillsWin
          brStatData.br.longestStreakWin = winStats.longestStreakWin
        }

        // Save
        brStatData.lastUpdate = new Date()
        await brStatsService.save(brStatData)
      }

      console.log(`Getting rebirth stats for '${gamertag}' and platform '${platform}'...`)
      const rebithStats = await playerMatchesService.getRebirthStats(gamertag, platform)
      
      if(rebithStats) {
        // delete _id it should be autogenerated.
        delete rebithStats._id;

        rebithStats.username = gamertag
        rebithStats.platform = platform
        rebithStats.date = date
        rebithStats.teams = teams

        rebithStats.kdRatio = rebithStats.kills/rebithStats.deaths
        //rebithStats.kdRatio = Math.round(((rebithStats.kills/rebithStats.deaths) + Number.EPSILON) * 100) / 100

        // Custom Stats
        rebithStats.killsPerGame = rebithStats.kills/rebithStats.gamesPlayed
        rebithStats.killsPerMin = rebithStats.kills/(rebithStats.timePlayed / 60)
        
        console.log(`Getting rebirth win stats for '${gamertag}' and platform '${platform}'...`)
        const rebithWinStats = await playerMatchesService.getRebirthWinStats(gamertag, platform)

        if(rebithWinStats && rebithWinStats.lastWin) {
          const lastWinDate = moment.unix(rebithWinStats.lastWin.utcStartSeconds)
          console.log(`[${new Date().toISOString()}] ${gamertag} rebirth last win match id: ${rebithWinStats.lastWin.matchID} on ${lastWinDate.utcOffset(-300).format('YYYY-MM-DD hh:mm:ss')}`)
          rebithStats.wins = rebithWinStats.wins
          rebithStats.maxKillsWin = rebithWinStats.maxKillsWin
          rebithStats.longestStreakWin = rebithWinStats.longestStreakWin
          rebithStats.lastWin = {
            matchID: rebithWinStats.lastWin.matchID,
            date: lastWinDate.toDate(),
            utcStartSeconds: rebithWinStats.lastWin.utcStartSeconds,
            utcEndSeconds: rebithWinStats.lastWin.utcEndSeconds,
            playerStats: rebithWinStats.lastWin.playerStats,
          }

          // Custom Stats
          rebithStats.winsPercent = ((rebithStats.wins*100)/rebithStats.gamesPlayed)
          rebithStats.gamesPerWin = rebithStats.gamesPlayed/rebithStats.wins
        }

        // console.log(`[${new Date().toISOString()}] ${gamertag} rebirth stats:`)
        // console.dir(rebithStats)
        await rebirthStatsService.add(rebithStats)
      } else {
        console.log(`[${new Date().toISOString()}] ${gamertag} has not rebirth stats`)
      }
    }
    console.timeEnd('AggregateStats')
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



module.exports = aggregateJob