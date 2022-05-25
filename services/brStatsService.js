var moment = require('moment')

const brStatsService = class BrStatsService {
  constructor(mongoClient, database, api) {
    this.mongoClient = mongoClient
    this.database = database
    this.API = api
  }

  async init() {
    // Create Collection is not exists
    this.brstats = this.database.collection('brstats');
    // Indexes
    await this.brstats.createIndex({
      date: -1
    })
    // Unique Index
    await this.brstats.createIndex({
      platform: 1,
      username: 1,
      date: -1
    }, {
      unique: true
    })
  }

  async add(gamertag, platform, date, teams) {
    console.time(`brstats ${gamertag}`)
    let brstatsData = await this.API.MWBattleData(gamertag, platform);
    brstatsData.date = date
    brstatsData.lastUpdate = new Date()
    brstatsData.username = gamertag
    brstatsData.platform = platform
    brstatsData.teams = teams

    // Custom stats
    const brData = brstatsData.br
    brData.winsPercent = ((brData.wins*100)/brData.gamesPlayed)
    brData.killsPerGame = brData.kills/brData.gamesPlayed
    brData.gamesPerWin = brData.gamesPlayed/brData.wins
    brData.killsPerMin = brData.kills/(brData.timePlayed / 60)

    await this.brstats.updateOne({
      username: gamertag,
      platform: platform,
      date: date,
    }, {
      $set: brstatsData
    }, {
      upsert: true
    })
    console.timeEnd(`brstats ${gamertag}`)
  }

  async saveLastWin(gamertag, platform, date, lastWinObj) {
    await this.brstats.updateOne({
      username: gamertag,
      platform: platform,
      date: date,
    }, {
      $set: {
        lastUpdate: new Date(),
        'br.lastWin': lastWinObj
      }
    })
  }

  async getAll() {
    return await this.brstats.find({})
  }
}

module.exports = brStatsService
