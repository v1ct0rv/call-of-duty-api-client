const matchesService = class MatchesService {
  constructor(mongoClient, database, api, playerMatchesService) {
    this.mongoClient = mongoClient
    this.database = database
    this.API = api
    this.playerMatchesService = playerMatchesService
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

  async syncMatches() {
    console.time(`syncMatches`)
    let playerMatches = await this.playerMatchesService.getAllPendingToSync()
    for (const match of playerMatches) {
      if(! await this.exists(match.matchID)) {
        console.time(`syncMatches: queryMatch ${match.matchID}`)
        const matchInfo = await this.API.MWFullMatchInfowz(match.matchID)
        matchInfo.matchID = match.matchID
        console.timeEnd(`syncMatches: queryMatch ${match.matchID}`)
        await this.matches.insertOne(matchInfo)
        // Sleep to avoid errors too many requests
        await this.sleep(500)
      }
      // Set the match loaded
      await this.playerMatchesService.setMatchesSynched(match.matchID)
    }
    console.timeEnd(`syncMatches`)
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
}

module.exports = matchesService
