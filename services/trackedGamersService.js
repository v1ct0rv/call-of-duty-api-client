const yaml = require('js-yaml')
const fs   = require('fs')
const path = require('path')

const trackedGamersService = class TrackedGamersService {
  constructor(mongoClient, database) {
    this.mongoClient = mongoClient;
    this.database = database;
  }

  async init() {
    // Create Collection is not exists
    this.trackedGamers = this.database.collection('trackedgamers');
    await this.trackedGamers.createIndex({
      platform: 1,
      gamertag: 1
    }, {
      unique: true
    });

    // bootstrap data
    this.bootstrapData()
  }

  async add(gamertag, platform) {
    const gamer = {
      gamertag,
      platform
    };
    return await this.trackedGamers.updateOne(gamer, {
      $set: gamer
    }, {
      upsert: true
    })
  }

  async disableGamer(gamertag, platform, reason) {
    const gamer = {
      gamertag,
      platform
    };
    return await this.trackedGamers.updateOne(gamer, {
      $set: {
        disabled: true,
        reason: reason
      }
    })
  }

  async enableGamer(gamertag, platform) {
    const gamer = {
      gamertag,
      platform
    };
    return await this.trackedGamers.updateOne(gamer, {
      $set: {
        disabled: false
      }
    })
  }

  async setOldMatchesSynched(gamertag, platform) {
    const gamer = {
      gamertag,
      platform
    };
    return await this.trackedGamers.updateOne(gamer, {
      $set: {
        syncOldMatches: true
      }
    })
  }

  async setLastOldMatchesSync(gamertag, platform, lastOldMatchesSyncDate) {
    const gamer = {
      gamertag,
      platform
    };
    return await this.trackedGamers.updateOne(gamer, {
      $set: {
        lastOldMatchesSyncDate
      }
    })
  }

  async getAll() {
    const cursor = await this.trackedGamers.find({})
    try {
      return await cursor.toArray()
    } finally {
      cursor.close()
    }
  }

  async get(gamertag, platform) {
    return await this.trackedGamers.findOne({
      gamertag,
      platform
    })
  }

  async update(gamer) {
    return await this.trackedGamers.updateOne({
      gamertag: gamer.gamertag,
      platform: gamer.platform
    }, {
      $set: gamer
    })
  }

  // Insert some gamers
  // Platforms
  // psn      /* PlayStation */
  // steam /* Steam */
  // battle  /* BattleNET */
  // xbl       /* XBOX */
  // acti     /* Activision ID */
  // uno     /* numerical representation of Activision ID */
  // all       /* All platforms, used for fuzzySearch */
  async bootstrapData() {
    const gamers = yaml.load(fs.readFileSync(path.join(__dirname, '../data/gamers.yml'), 'utf8'))
    for (const gamer of gamers) {
      gamer.gamertag = gamer.gamertag.toLowerCase()
      await this.trackedGamers.updateOne({ gamertag: gamer.gamertag, platform: gamer.platform }, {
        $set: gamer
      }, {
        upsert: true
      })
    }
  }
}

module.exports = trackedGamersService
