import moment from "moment";

const last100GamesStatsService = class Last100GamesStatsService {
  constructor(mongoClient, database) {
    this.mongoClient = mongoClient
    this.database = database
  }

  async init() {
    // Create Collection is not exists
    this.last100gamesstats = this.database.collection('last100gamesstats');
    // Indexes
    await this.last100gamesstats.createIndex({
      date: -1
    })
    // Unique Index
    await this.last100gamesstats.createIndex({
      platform: 1,
      username: 1,
      gameMode: 1,
    }, {
      unique: true
    })
  }

  async add(last100GamesStats) {
    last100GamesStats.lastUpdate = new Date()

    await this.last100gamesstats.updateOne({
      username: last100GamesStats.username,
      platform: last100GamesStats.platform,
      gameMode: last100GamesStats.gameMode,
    }, {
      $set: last100GamesStats
    }, {
      upsert: true
    })
  }

  async getAll() {
    return await this.last100gamesstats.find({})
  }
}

export default last100GamesStatsService
