import moment from "moment";

const rebirthStatsService = class RebirthStatsService {
  constructor(mongoClient, database) {
    this.mongoClient = mongoClient
    this.database = database
  }

  async init() {
    // Create Collection is not exists
    this.rebirthstats = this.database.collection('rebirthstats');
    // Indexes
    await this.rebirthstats.createIndex({
      date: -1
    })
    // Unique Index
    await this.rebirthstats.createIndex({
      platform: 1,
      username: 1,
      date: -1
    }, {
      unique: true
    })
  }

  async add(rebithStats) {
    rebithStats.lastUpdate = new Date()

    await this.rebirthstats.updateOne({
      username: rebithStats.username,
      platform: rebithStats.platform,
      date: rebithStats.date,
    }, {
      $set: rebithStats
    }, {
      upsert: true
    })
  }

  async getAll() {
    return await this.rebirthstats.find({})
  }
}

export default rebirthStatsService
