const matchesService = class MatchesService {
  constructor(mongoClient, database, api, playerMatchesService, configService) {
    this.mongoClient = mongoClient
    this.database = database
    this.API = api
    this.playerMatchesService = playerMatchesService
    this.configService = configService
  }

  async init() {
    // Create Collection is not exists
    this.matches = this.database.collection('matches');
    await this.matches.createIndex({
      matchID: 1,
    }, {
      unique: true
    });
  }

  async syncMatches(forceSycn = false) {
    const syncMatchesEnabled = await this.configService.get('syncMatches.enabled')
    if(syncMatchesEnabled || forceSycn) {
      console.time(`syncMatches`)
      let playerMatches = await this.playerMatchesService.getAllPendingToSync()
      for (const match of playerMatches) {
        if(! await this.exists(match.matchID)) {
          let dateString = new Date().toISOString()
          console.time(`[${dateString}] syncMatches: queryMatch ${match.matchID}`)
          try {
            const matchInfo = await this.API.MWFullMatchInfowz(match.matchID, match.platform)
            matchInfo.matchID = match.matchID
            console.timeEnd(`[${dateString}] syncMatches: queryMatch ${match.matchID}`)
            await this.matches.insertOne(matchInfo)
          } catch(Error) {
              console.error(`Error fetching match ${match.matchID}: ${Error}`)
          }
          // Sleep to avoid errors too many requests
          await this.sleep(this.randomIntFromInterval(100, 500))
        }
        // Set the match loaded
        await this.playerMatchesService.setMatchesSynched(match.matchID)
      }
      console.timeEnd(`syncMatches`)
    } else {
      console.log(`[${new Date().toISOString()}] syncMatches is disabled, skipping...`)
    }
  }

  async getAll() {
    return await this.matches.find({})
  }

  async exists(matchID) {
    let count = await this.matches.countDocuments({ matchID: matchID})
    return count > 0
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}

module.exports = matchesService
