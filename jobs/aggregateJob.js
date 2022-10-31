import { MongoClient } from "mongodb";
import moment from "moment";

import TrackedGamersService from "../services/trackedGamersService.js";
import PlayerMatchesService from "../services/playerMatchesService.js";
import RebirthStatsService from "../services/rebirthStatsService.js";
import BrStatsService from "../services/brStatsService.js";
import Last100GamesStatsService from "../services/last100GamesStatsService.js";

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

    const last100GamesStatsService = new Last100GamesStatsService(client, database)
    await last100GamesStatsService.init()

    const rebirthStatsService = new RebirthStatsService(client, database)
    await rebirthStatsService.init()

    const brStatsService = new BrStatsService(client, database, null)
    await brStatsService.init()

    const SINGLE_GAMER = process.env.SINGLE_GAMER || false;
    let gamers = []
    if (SINGLE_GAMER === 'true') {
      gamers.push(await trackedGamersService.get(process.env.SINGLE_GAMERTAG, process.env.SINGLE_GAMER_PLATFORM))
    } else {
      gamers = await trackedGamersService.getAll()
    }

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

        // Get winIsWin data
        console.log(`Getting Last WinIsWin data...`)
        console.time(`getWinIsWindata ${gamertag}`)
        const winIsWindata = await playerMatchesService.getWinIsWindata(gamertag, platform, "br")
        console.timeEnd(`getWinIsWindata ${gamertag}`)

        if(winIsWindata) {
          const lastWinIsWinDate = moment.unix(winIsWindata.lastWinIsWinDate)
          console.log(`[${new Date().toISOString()}] ${gamertag} last winIsWin match id: ${winIsWindata.lastWinIsWinMatchId} on ${lastWinIsWinDate.utcOffset(-300).format('YYYY-MM-DD hh:mm:ss')}`)
          brStatData.br.winIsWin = winIsWindata.winIsWin
          brStatData.br.lastWinIsWinMatchId = winIsWindata.lastWinIsWinMatchId
          brStatData.br.lastWinIsWinDate = lastWinIsWinDate.toDate()
        } else {
          brStatData.br.winIsWin = 0
        }

        // Get getMaxWinsInDay data
        console.time(`getMaxWinsInDayData ${gamertag}`)
        const maxWinsInDay = await playerMatchesService.getMaxWinsInDay(gamertag, platform, gamer.offsetSeconds, "br")
        console.timeEnd(`getMaxWinsInDayData ${gamertag}`)
        if(maxWinsInDay) {
          brStatData.br.maxWinsInDayDate = maxWinsInDay._id
          brStatData.br.maxWinsInDayCount = maxWinsInDay.count
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

        // Get winIsWin data
        console.log(`Getting rebirth Last WinIsWin data...`)
        console.time(`getWinIsWindata ${gamertag}`)
        const winIsWindata = await playerMatchesService.getWinIsWindata(gamertag, platform, "rebirth")
        console.timeEnd(`getWinIsWindata ${gamertag}`)

        if(winIsWindata) {
          const lastWinIsWinDate = moment.unix(winIsWindata.lastWinIsWinDate)
          console.log(`[${new Date().toISOString()}] ${gamertag} last winIsWin match id: ${winIsWindata.lastWinIsWinMatchId} on ${lastWinIsWinDate.utcOffset(-300).format('YYYY-MM-DD hh:mm:ss')}`)
          rebithStats.winIsWin = winIsWindata.winIsWin
          rebithStats.lastWinIsWinMatchId = winIsWindata.lastWinIsWinMatchId
          rebithStats.lastWinIsWinDate = lastWinIsWinDate.toDate()
        } else {
          rebithStats.winIsWin = 0
        }

        console.time(`getMaxWinsInDayData ${gamertag}`)
        const maxWinsInDay = await playerMatchesService.getMaxWinsInDay(gamertag, platform, gamer.offsetSeconds, "rebirth")
        console.timeEnd(`getMaxWinsInDayData ${gamertag}`)
        if(maxWinsInDay) {
          rebithStats.maxWinsInDayDate = maxWinsInDay._id
          rebithStats.maxWinsInDayCount = maxWinsInDay.count
        }

        // console.log(`[${new Date().toISOString()}] ${gamertag} rebirth stats:`)
        // console.dir(rebithStats)
        await rebirthStatsService.add(rebithStats)
      } else {
        console.log(`[${new Date().toISOString()}] ${gamertag} has not rebirth stats`)
      }

      console.log(`Getting last 100 games stats for '${gamertag}' and platform '${platform}'...`)
      const last100BrGamesStats = await playerMatchesService.getLast100GamesStats(gamertag, platform, "br")

      if (last100BrGamesStats) {
        // delete _id it should be autogenerated.
        delete last100BrGamesStats._id;

        last100BrGamesStats.username = gamertag
        last100BrGamesStats.platform = platform
        last100BrGamesStats.teams = teams
        last100BrGamesStats.gameMode = "br"

        last100BrGamesStats.kdRatio = last100BrGamesStats.kills/last100BrGamesStats.deaths

        // Custom Stats
        last100BrGamesStats.killsPerGame = last100BrGamesStats.kills/last100BrGamesStats.gamesPlayed

        await last100GamesStatsService.add(last100BrGamesStats)
      } else {
        console.log(`[${new Date().toISOString()}] ${gamertag} has not last100 games stats`)
      }

      console.log(`Getting last 100 rebirth games stats for '${gamertag}' and platform '${platform}'...`)
      const last100RebirthGamesStats = await playerMatchesService.getLast100GamesStats(gamertag, platform, "rebirth")

      if (last100RebirthGamesStats) {
        // delete _id it should be autogenerated.
        delete last100RebirthGamesStats._id;

        last100RebirthGamesStats.username = gamertag
        last100RebirthGamesStats.platform = platform
        last100RebirthGamesStats.teams = teams
        last100RebirthGamesStats.gameMode = "rebirth"

        last100RebirthGamesStats.kdRatio = last100RebirthGamesStats.kills/last100RebirthGamesStats.deaths

        // Custom Stats
        last100RebirthGamesStats.killsPerGame = last100RebirthGamesStats.kills/last100RebirthGamesStats.gamesPlayed

        await last100GamesStatsService.add(last100RebirthGamesStats)
      } else {
        console.log(`[${new Date().toISOString()}] ${gamertag} has not last100 rebirth games stats`)
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

export default aggregateJob
