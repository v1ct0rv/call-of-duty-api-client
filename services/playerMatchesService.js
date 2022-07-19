const moment = require('moment')
const constants = require("../core/constants")

const playerMatchesService = class PlayerMatchesService {
  constructor(mongoClient, database, api, trackedGamersService) {
    this.mongoClient = mongoClient
    this.database = database
    this.API = api
    this.trackedGamersService = trackedGamersService
  }

  async init() {
    // Create Collection is not exists
    this.playerMatches = this.database.collection('playermatches')

    await this.playerMatches.createIndex({
      platform: 1,
      username: 1,
      matchID: 1,
    }, {
      unique: true
    })
    await this.playerMatches.createIndex({
      sync: 1
    })
  }

  async add(gamertag, platform) {
    console.time(`playermatches ${gamertag}`)
    // Sync last 20 matches
    const playerMatchesData = await this.API.MWcombatwz(gamertag, platform)
    const gamer = await this.trackedGamersService.get(gamertag, platform)

    for (const match of playerMatchesData.matches) {
      // Update UnoId in gamer table if not exists
      if (!gamer.uno) {
        gamer.uno = match.player.uno
        // set player old matches synched
        await this.trackedGamersService.update(gamer)
      }
      match.lastUpdate = new Date()
      match.username = gamertag
      match.platform = platform
      await this.playerMatches.updateOne({
        username: gamertag,
        platform: platform,
        matchID: match.matchID,
      }, {
        $set: match
      }, {
        upsert: true
      })
    }
    console.timeEnd(`playermatches ${gamertag}`)
  }

  async getAll() {
    return await this.playerMatches.find({})
  }

  async getAllPendingToSync() {
    const cursor = await this.playerMatches.find({ $or: [{ sync: { $exists: false } }, { sync: false }] })
    try {
      return await cursor.toArray()
    } finally {
      cursor.close()
    }
  }

  async setMatchesSynched(matchID) {
    await this.playerMatches.updateMany({
      matchID: matchID
    }, {
      $set: {
        sync: true
      }
    })
  }

  async forceReSyncAllMatches() {
    console.time(`forceReSyncAllMatches`)
    console.log(`Forcing all matches to resync...`)

    const result = await this.playerMatches.updateMany({ sync: true }, {
      $set: {
        sync: false
      }
    })

    console.log(`${result.modifiedCount} matches were set to resync...`)
    console.timeEnd(`forceReSyncAllMatches`)
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getMaxWinsInDay(gamertag, platform, offsetSeconds, gameMode) {
    const mode = (gameMode === "br") ? constants.BR_MODES : constants.REBIRTH_MODES
    const aggCursor = this.playerMatches.aggregate([
      // Stage 1: Filter All BR / Rebirth Wins
      {
        $match: { platform, username: gamertag, "playerStats.teamPlacement": 1, "mode": { $in: mode } }
      },
      // Stage 2: Sort by date desc
      {
        $sort: {
          "utcStartSeconds": -1
        }
      },
      // Stage 3: group by date utcStartSeconds
      {
        "$group": {
          "_id": {
            "$dateToString": {
              "format": "%Y-%m-%d",
              "date": {
                "$toDate": {
                  "$multiply": [1000, { "$sum": [offsetSeconds, "$utcStartSeconds"] }] // Sum the offset 5 hours (-18000 secs) then multiply by 1000 (milliseconds)
                }
              }
            }
          },
          "count": { "$sum": 1 }
        }
      },
      // Stage 4: Sort by cound desc
      {
        $sort: {
          "count": -1
        }
      },
      // Take the first
      { $limit: 1 }
    ])

    var results = []
    for await (const doc of aggCursor) {
      results.push(doc)
    }

    return results[0]
  }

  async getLastWinMatch(gamertag, platform) {
    const aggCursor = this.playerMatches.aggregate([
      // Stage 1: Filter by All PLayer Rebirth Wins
      {
        $match: { platform, username: gamertag, "playerStats.teamPlacement": 1, "mode": { $in: constants.BR_MODES } }
      },
      // Stage 2: sort by utcStartSeconds to get last match
      {
        $sort: {
          utcStartSeconds: -1
        }
      },
      // Stage 3: Count and get MaxKills and LongestStreaks in a win an last won match
      {
        $group: {
          _id: "", wins: { $sum: 1 }, maxKillsWin: { $max: "$playerStats.kills" }, longestStreakWin: { $max: "$playerStats.longestStreak" }, lastWin: {
            "$first": "$$ROOT"
          }
        }
      }
    ])

    var results = []
    for await (const doc of aggCursor) {
      results.push(doc)
    }

    return results[0]
  }

  async getRebirthWinStats(gamertag, platform) {
    const aggCursor = this.playerMatches.aggregate([
      // Stage 1: Filter by All PLayer Rebirth Wins
      {
        $match: { platform, username: gamertag, "playerStats.teamPlacement": 1, "mode": { $in: constants.REBIRTH_MODES } }
      },
      // Stage 2: sort by utcStartSeconds to get last match
      {
        $sort: {
          utcStartSeconds: -1
        }
      },
      // Stage 3: Count and get MaxKills and LongestStreaks in a win an last won match
      {
        $group: {
          _id: "", wins: { $sum: 1 }, maxKillsWin: { $max: "$playerStats.kills" }, longestStreakWin: { $max: "$playerStats.longestStreak" }, lastWin: {
            "$first": "$$ROOT"
          }
        }
      }
    ])

    var results = []
    for await (const doc of aggCursor) {
      results.push(doc)
    }

    return results[0]
  }

  async getRebirthStats(gamertag, platform) {
    const aggCursor = this.playerMatches.aggregate([
      // Stage 1: Filter by All PLayer Rebirth Matches
      {
        $match: { platform, username: gamertag, "mode": { $in: constants.REBIRTH_MODES } }
      },
      // Stage 2:Count and get Kills, deatchs, MaxKills and LongestStreaks
      {
        $group: { _id: "", gamesPlayed: { $sum: 1 }, kills: { $sum: "$playerStats.kills" }, deaths: { $sum: "$playerStats.deaths" }, maxKills: { $max: "$playerStats.kills" }, longestStreak: { $max: "$playerStats.longestStreak" }, timePlayed: { $sum: "$playerStats.timePlayed" } }
      }
    ])

    var results = []
    for await (const doc of aggCursor) {
      results.push(doc)
    }

    return results[0]
  }

  async getLast100GamesStats(gamertag, platform, gameMode) {
    const mode = (gameMode === "br") ? constants.BR_MODES : constants.REBIRTH_MODES
    const aggCursor = this.playerMatches.aggregate([
      // Stage 1: Filter by All PLayer Rebirth Matches
      {
        $match: { platform, username: gamertag, "mode": { $in: mode } }
      },
      // Stage 2: sort the remainder last-first
      {
        "$sort": {
          "utcStartSeconds": -1
        }
      },
      // Stage 3: keep only 100 of the descending order subset
      {
        "$limit": 100
      },
      // Stage 4: Get Kills, deatchs, MaxKills and LongestStreaks
      {
        $group: { _id: "", gamesPlayed: { $sum: 1 }, kills: { $sum: "$playerStats.kills" }, deaths: { $sum: "$playerStats.deaths" }, maxKills: { $max: "$playerStats.kills" }, longestStreak: { $max: "$playerStats.longestStreak" }, timePlayed: { $sum: "$playerStats.timePlayed" } }
      }
    ])

    var results = []
    for await (const doc of aggCursor) {
      results.push(doc)
    }

    return results[0]
  }

  async getWinIsWindata(gamertag, platform, gameMode) {
    const mode = (gameMode === "br") ? constants.BR_MODES : constants.REBIRTH_MODES
    const aggCursor = this.playerMatches.aggregate([
      // Stage 1: Filter by All PLayer Rebirth Wins
      {
        $match: { platform, username: gamertag, "playerStats.teamPlacement": 1, "playerStats.kills": 0, "mode": { $in: mode } }
      },
      // Stage 2: sort by utcStartSeconds to get last match
      {
        $sort: {
          utcStartSeconds: -1
        }
      },
      // Stage 3: Count and get MaxKills and LongestStreaks in a win an last won match
      {
        $group: {
          _id: "", winIsWin: { $sum: 1 }, lastWinIsWinMatchId: { "$first": "$$ROOT.matchID" }, lastWinIsWinDate: { "$first": "$$ROOT.utcStartSeconds" }
        }
      }
    ])

    var results = []
    for await (const doc of aggCursor) {
      results.push(doc)
    }

    return results[0]
  }

  async getMaxBRStats(gamertag, platform) {
    const aggCursor = this.playerMatches.aggregate([
      // Stage 1: Filter All player BR Matches
      {
        $match: { platform, username: gamertag, "mode": { $in: constants.BR_MODES } }
      },
      // Stage 2: Sort by Kills desc
      {
        $sort: {
          "playerStats.kills": -1
        }
      },
      // Stage 3: Group remaining documents and calculate maxKills wins and longestStreak
      {
        $group: {
          _id: "", wins: { $sum: 1 }, maxKills: { $max: "$playerStats.kills" }, longestStreak: { $max: "$playerStats.longestStreak" }, "doc": {
            "$first": "$$ROOT"
          }
        }
      }
    ])

    var results = []
    for await (const doc of aggCursor) {
      results.push(doc)
    }

    return results[0]
  }

  async syncOldMatches(gamer) {
    const gamertag = gamer.gamertag
    const platform = gamer.platform
    console.time(`syncOldMatches`)

    // Get all matches if this player was not sync before
    console.log(`[${new Date().toISOString()}] Loading old matches for gamertag '${gamertag}' and platform '${platform}'...`)
    // We will iterate from March 10 (Warzone release date) or player last syunc till now, going 2 hours step
    let wzStart = gamer.lastOldMatchesSyncDate ? moment(gamer.lastOldMatchesSyncDate) : moment('2020-03-10')
    let now = moment()
    let startMillis = 0
    let currentMillis = 0
    let errors = false
    for (var start = moment(wzStart); start.isBefore(now); start.add(2, 'hours')) {
      let end = moment(start).add(2, 'hours')
      console.log(`[${new Date().toISOString()}] Getting old matches for gamertag '${gamertag}' and platform '${platform}' from '${start.format('YYYY-MM-DD HH:mm:ss')}' to '${end.format('YYYY-MM-DD HH:mm:ss')}'`)
      let oldMatchesData
      try {
        oldMatchesData = await this.API.MWcombatwzdate(gamertag, start.valueOf(), end.valueOf(), platform)
      } catch (error) {
        console.log(`'${error.toLowerCase()}'`)
        // If the errror is not allowed, continue with next gamertag
        if (error.toLowerCase() === "not permitted: not allowed") {
          start = moment()
          console.error(error)
          errors = true
          continue
        }
        throw (error)
      }
      //console.dir(oldMatchesData)
      if (oldMatchesData && oldMatchesData.matches) {
        console.log(`[${new Date().toISOString()}] ${oldMatchesData.matches.length} old matches received'`)

        for (const match of oldMatchesData.matches) {
          match.lastUpdate = new Date()
          match.username = gamertag
          match.platform = platform
          await this.playerMatches.updateOne({
            username: gamertag,
            platform: platform,
            matchID: match.matchID
          }, {
            $set: match
          }, {
            upsert: true
          })
        }
      }

      // Update lastOldMatchesSync
      gamer.lastOldMatchesSyncDate = end.toDate()
      this.trackedGamersService.setLastOldMatchesSync(gamertag, platform, end.toDate())

      // Sleep to avoid errors too many requests
      let randomSleep = this.randomIntFromInterval(500, 1500)
      currentMillis += randomSleep

      // If there passed 50 seconds lets wait 30 seconds.
      if ((currentMillis - startMillis) >= 50000) {
        startMillis = currentMillis
        console.log(`Limit reached, waiting 180 seconds...`)
        randomSleep = 180000
      }

      await this.sleep(randomSleep)

      // // Sleep to avoid errors too many requests
      // await this.sleep(this.randomIntFromInterval(1200, 5000))
    }

    if (!errors) {
      this.trackedGamersService.setOldMatchesSynched(gamertag, platform)
      console.log(`[${new Date().toISOString()}] All Old matches are synched for ${gamertag}, skipping...`)
    }

    console.timeEnd(`syncOldMatches`)

  }

  randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}

module.exports = playerMatchesService
