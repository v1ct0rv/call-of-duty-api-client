const playerMatchesService = class PlayerMatchesService {
  constructor(mongoClient, database, api) {
    this.mongoClient = mongoClient
    this.database = database
    this.API = api
  }

  async init() {
    // Create Collection is not exists
    this.playerMatches = this.database.collection('playermatches');
    await this.playerMatches.createIndex({
      platform: 1,
      username: 1,
      matchID: 1,
    }, {
      unique: true
    });
  }

  async add(gamertag, platform) {
    console.time(`playermatches ${gamertag}`)
    let playerMatchesData = await this.API.MWcombatwz(gamertag, platform)
    for (const match of playerMatchesData.matches) {
      match.lastUpdate = new Date()
      match.username = gamertag
      match.platform = platform
      match.sync = false
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
    console.timeEnd(`playermatches ${gamertag}`)
  }

  async getAll() {
    return await this.playerMatches.find({})
  }

  async getAllPendingToSync() {
    const cursor = await this.playerMatches.find({ sync: false })
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
}

module.exports = playerMatchesService
