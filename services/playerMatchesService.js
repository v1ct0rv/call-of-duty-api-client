var moment = require('moment')

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
      if(!gamer.uno) {
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
        matchID: match.matchID
      }, {
        $set: match
      }, {
        upsert: true
      })
    }

    // Get all matches if this player was not sync before
    if(!gamer.syncOldMatches) {
      // We will iterate from March 10 (Warzone release date) till now, going 2 monts
      let wzStart = moment('2020-03-10');
      let now = moment()
      for (var start = moment(wzStart); start.isBefore(now); start.add(2, 'months')) {
        let end = moment(start).add(2, 'months')
        console.log(`Getting old matches from '${start.format('YYYY-MM-DD hh:mm:ss')}' to '${end.format('YYYY-MM-DD hh:mm:ss')}'`);
        let oldMatchesData = await this.API.MWfullcombatwzdate(gamertag, start.valueOf(), end.valueOf(), platform)
        for (const match of oldMatchesData) {
          await this.playerMatches.updateOne({
            username: gamertag,
            platform: platform,
            matchID: match.matchId
          }, {
            $set: {
              username: gamertag,
              platform: platform,
              matchId: match.matchId,
              utcStartSeconds: match.timestamp/1000
            }
          }, {
            upsert: true
          })
        }

        // Sleep to avoid errors too many requests
        await this.sleep(1000)
      }

      // set player old matches synched
      await this.trackedGamersService.setOldMatchesSynched(gamertag, platform)
    }
    console.timeEnd(`playermatches ${gamertag}`)
  }

  async getAll() {
    return await this.playerMatches.find({})
  }

  async getAllPendingToSync() {
    const cursor = await this.playerMatches.find({ $or: [{sync: { $exists: false}}, { sync: false }]})
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

  async getLastWinMatch(gamertag, platform) {
    const options = {
      sort: { utcStartSeconds: -1 }
    };
    return await this.playerMatches.findOne({platform, username : gamertag, "playerStats.teamPlacement": 1}, options)
  }
}

module.exports = playerMatchesService
