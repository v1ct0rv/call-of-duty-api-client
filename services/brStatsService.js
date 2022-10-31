import moment from "moment";

const brStatsService = class BrStatsService {
  constructor(mongoClient, database, api) {
    this.mongoClient = mongoClient
    this.database = database
    this.API = api
    this.Warzone = api?.Warzone
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

  MWBattleData = async function (gamertag, platform) {
    return new Promise((resolve, reject) => {
      let brDetails = {};
      this.Warzone.fullData(gamertag, platform).then(data => {
        let lifetime = data.data.lifetime;
        if (void 0 !== lifetime) {
          let filtered = Object.keys(lifetime.mode).filter((x => x.startsWith("br"))).reduce(((obj, key) => (obj[key] = lifetime.mode[key], obj)), {});
          void 0 !== filtered.br && (filtered.br.properties.title = "br", brDetails.br = filtered.br.properties), void 0 !== filtered.br_dmz && (filtered.br_dmz.properties.title = "br_dmz", brDetails.br_dmz = filtered.br_dmz.properties), void 0 !== filtered.br_all && (filtered.br_all.properties.title = "br_all", brDetails.br_all = filtered.br_all.properties)
        }
        resolve(brDetails)
      }).catch((e => reject(e)))
    })
  }

  async add(gamertag, platform, date, teams) {
    console.time(`brstats ${gamertag}`)
    let brstatsData = await this.MWBattleData(gamertag, platform);
    brstatsData.date = date
    brstatsData.lastUpdate = new Date()
    brstatsData.username = gamertag
    brstatsData.platform = platform
    brstatsData.teams = teams

    // Custom stats
    const brData = brstatsData.br
    brData.winsPercent = ((brData.wins * 100) / brData.gamesPlayed)
    brData.killsPerGame = brData.kills / brData.gamesPlayed
    brData.gamesPerWin = (brData.wins > 0) ? brData.gamesPlayed / brData.wins : 0
    brData.killsPerMin = brData.kills / (brData.timePlayed / 60)

    // Complete existing data
    let currentStats = await this.brstats.findOne({ username: gamertag, platform, date: date })
    if (currentStats?.br) {
      brstatsData.br.lastWin = currentStats.br.lastWin
      brstatsData.br.longestStreak = currentStats.br.longestStreak
      brstatsData.br.longestStreakWin = currentStats.br.longestStreakWin
      brstatsData.br.maxKills = currentStats.br.maxKills
      brstatsData.br.maxKillsWin = currentStats.br.maxKillsWin
      brstatsData.br.winIsWin = currentStats.br.winIsWin
      brstatsData.br.lastWinIsWinMatchId = currentStats.br.lastWinIsWinMatchId
      brstatsData.br.lastWinIsWinDate = currentStats.br.lastWinIsWinDate
      brstatsData.br.maxWinsInDayDate = currentStats.br.maxWinsInDayDate
      brstatsData.br.maxWinsInDayCount = currentStats.br.maxWinsInDayCount
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

  async saveLastWin(gamertag, platform, date, lastWinObj) {
    await this.brstats.updateOne({
      username: gamertag,
      platform: platform,
      date: date,
    }, {
      $set: {
        lastUpdate: new Date(),
        'br.lastWin': lastWinObj,
      }
    })
  }

  async save(brstatsData) {
    await this.brstats.updateOne({
      username: brstatsData.username,
      platform: brstatsData.platform,
      date: brstatsData.date,
    }, {
      $set: brstatsData
    }, {
      upsert: true
    })
  }

  async get(gamertag, platform, date) {
    return await this.brstats.findOne({
      username: gamertag,
      platform: platform,
      date: date,
    })
  }

  async getAll() {
    return await this.brstats.find({})
  }
}

export default brStatsService
