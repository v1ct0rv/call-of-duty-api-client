const recentMatchesService = class RecentMatchesService {
  constructor(mongoClient, database, api) {
    this.mongoClient = mongoClient
    this.database = database
    this.API = api
  }

  async init() {
    // Create Collection is not exists
    this.recentmatches = this.database.collection('recentmatches');
  }

  async add(gamertag, platform, date) {
    console.time(`recentmatches ${gamertag}`)
    let recentmatchesData = await this.API.MWcombatwz(gamertag, platform)
    recentmatchesData.date = new Date()
    recentmatchesData.username = gamertag
    recentmatchesData.platform = platform
    await this.recentmatches.insertOne(recentmatchesData)
    console.timeEnd(`recentmatches ${gamertag}`)
  }

  async getAll() {
    return await this.recentmatches.find({})
  }
}

module.exports = recentMatchesService
