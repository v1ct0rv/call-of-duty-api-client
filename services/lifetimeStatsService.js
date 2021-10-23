const lifetimeStatsService = class LifetimeStatsService {
  constructor(mongoClient, database, api) {
    this.mongoClient = mongoClient
    this.database = database
    this.API = api
  }

  async init() {
    // Create Collection is not exists
    this.lifetimeStats = this.database.collection('lifetimestats');
    // Indexes
    await this.lifetimeStats.createIndex({
      date: -1
    })
    // Unique Index
    await this.lifetimeStats.createIndex({
      platform: 1,
      username: 1,
      date: -1
    }, {
      unique: true
    })
  }

  async add(gamertag, platform, date) {
    console.time(`lifetimeStats gamer: ${gamertag}, plattform: ${platform}`)
    let lifetimeStatsData = await this.API.MWwz(gamertag, platform)
    lifetimeStatsData.date = date
    lifetimeStatsData.platform = platform
    await this.lifetimeStats.updateOne({
      username: gamertag,
      platform: platform,
      date: date
    }, {
      $set: lifetimeStatsData
    }, {
      upsert: true
    })
    console.timeEnd(`lifetimeStats gamer: ${gamertag}, plattform: ${platform}`)
  }

  async getAll() {
    return await this.lifetimeStats.find({})
  }
}

module.exports = lifetimeStatsService
