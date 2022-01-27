var moment = require('moment')

const brStatsService = class BrStatsService {
  constructor(mongoClient, database, api, playerMatchesService) {
    this.mongoClient = mongoClient
    this.database = database
    this.API = api
    this.playerMatchesService = playerMatchesService
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

    // Set last win data
    console.time(`getLastWin ${gamertag}`)
    const lastWin = await this.playerMatchesService.getLastWinMatch(gamertag, platform)
    console.timeEnd(`getLastWin ${gamertag}`)

    if(lastWin) {
      const lastWinDate = moment.unix(lastWin.utcStartSeconds)
      console.log(`[${new Date().toISOString()}] ${gamertag} last win match id: ${lastWin.matchID} on ${lastWinDate.utcOffset(-300).format('YYYY-MM-DD hh:mm:ss')}`)
      brData.lastWin = {
        matchID: lastWin.matchID,
        date: lastWinDate.toDate(),
        utcStartSeconds: lastWin.utcStartSeconds,
        utcEndSeconds: lastWin.utcEndSeconds,
        playerStats: lastWin.playerStats,
      }

    }

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

  async getAll() {
    return await this.brstats.find({})
  }
}

module.exports = brStatsService
