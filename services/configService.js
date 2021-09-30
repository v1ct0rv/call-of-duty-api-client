const configService = class ConfigService {
  constructor(mongoClient, database) {
    this.mongoClient = mongoClient
    this.database = database
  }

  async init() {
    // Create Collection is not exists
    this.config = this.database.collection('config');
    // Unique Index
    await this.config.createIndex({
      key: 1
    }, {
      unique: true
    })
    this.bootstrapData();
  }

  async add(key, value) {
    await this.config.updateOne({
      key
    }, {
      $set: {
        key,
        value
      }
    }, {
      upsert: true
    })
  }

  async get(key) {
    return await this.config.findOne({
      key
    })
  }

  async getAll() {
    return await this.config.find({})
  }

  async bootstrapData() {
    // authentication mode (sso, username)
    if (process.env.AUTHENTICATION_MODE) {
      this.add('authentication.mode', process.env.AUTHENTICATION_MODE)
    } else {
      this.add('authentication.mode', 'sso')
    }

    if (process.env.SSO_TOKEN) {
      this.add('authentication.ssoToken', process.env.SSO_TOKEN)
    }

    if (process.env.USERNAME) {
      this.add('authentication.username', process.env.USERNAME)
    }

    if (process.env.PASSWORD) {
      this.add('authentication.password', process.env.PASSWORD)
    }

    if (process.env.TWO_CAPTCHA_API_KEY) {
      this.add('authentication.2captchaApiKey', process.env.TWO_CAPTCHA_API_KEY)
    }
  }
}

module.exports = configService
