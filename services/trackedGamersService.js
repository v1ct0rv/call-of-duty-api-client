import yaml from "js-yaml";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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
    await this.bootstrapData()
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
      },
      $unset: {
        reason: 1
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

  async setOldMatchesSynched(gamertag, platform) {
    const gamer = {
      gamertag,
      platform
    };
    return await this.trackedGamers.updateOne(gamer, {
      $set: {
        oldMatchesSynched: true
      }
    })
  }

  async getAll() {
    const cursor = await this.trackedGamers.find({ $or: [{disabled: { $exists: false}}, { disabled: false }]})
    try {
      return await cursor.toArray()
    } finally {
      cursor.close()
    }
  }

  async getAllOldMatchesNotSynched() {
    const cursor = await this.trackedGamers.find({ $or: [{oldMatchesSynched: { $exists: false}}, { oldMatchesSynched: false }]})
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
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const gamers = yaml.load(fs.readFileSync(join(__dirname, '../data/gamers.yml'), 'utf8'))
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

export default trackedGamersService
