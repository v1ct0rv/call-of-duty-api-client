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

  async getAll() {
    const cursor = await this.trackedGamers.find({})
    try {
      return await cursor.toArray()
    } finally {
      cursor.close()
    }
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
    const gamers = [{
      platform: 'battle',
      gamertag: 'v1ct0rv#1393'
    }, {
      platform: 'battle',
      gamertag: 'elmogo06#1516'
    }, {
      platform: 'battle',
      gamertag: 'amauryandrex#2675'
    }, {
      platform: 'psn',
      gamertag: 'juanjosemontoyax'
    }, {
      platform: 'psn',
      gamertag: 'pitjuan216'
    }, {
      platform: 'psn',
      gamertag: 'elcasco70'
    }, {
      platform: 'psn',
      gamertag: 'nickchain'
    }, {
      platform: 'battle',
      gamertag: 'kgb2283#1956'
    }, {
      platform: 'psn',
      gamertag: 'jdsilo'
    }, {
      platform: 'psn',
      gamertag: 'maurinho-07'
    }, {
      platform: 'psn',
      gamertag: 'egocadavid'
    }, {
      platform: 'battle',
      gamertag: 'nandiviry250#5004699'
    },
    {
      platform: 'battle',
      gamertag: 'zombiellama#11147'
    },
    {
      platform: 'battle',
      gamertag: 'jomacaf#1430'
    },
    {
      platform: 'psn',
      gamertag: 'saninandres1'
    },
    // {
    //   platform: '',
    //   gamertag: ''
    // },
    // {
    //   platform: '',
    //   gamertag: ''
    // },
    // {
    //   platform: '',
    //   gamertag: ''
    // },
    // {
    //   platform: '',
    //   gamertag: ''
    // },
    // {
    //   platform: '',
    //   gamertag: ''
    // },
    ]

    for (const gamer of gamers) {
      await this.trackedGamers.updateOne(gamer, {
        $set: gamer
      }, {
        upsert: true
      })
    }
  }
}

module.exports = trackedGamersService
