var moment = require('moment')

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

    // Indexes
    await this.matches.createIndex({
      date: -1
    })

    // // unique indexes
    // await this.matches.createIndex({
    //   matchID: 1,
    // }, {
    //   unique: true
    // });
  }

  async syncMatches(forceSycn = false, forceResync = false) {
    const syncMatchesEnabled = await this.configService.get('syncMatches.enabled')
    if(syncMatchesEnabled || forceSycn) {
      console.time(`syncMatches`)
      console.log(`[${new Date().toISOString()}] Getting all matches pending to sync...`)
      let playerMatches = await this.playerMatchesService.getAllPendingToSync()
      console.log(`[${new Date().toISOString()}] There are ${playerMatches.length} pending matches to sync...`)
      for (const match of playerMatches) {
        if(await this.exists(match.matchID)) {
          if(forceResync) {
            // delete record to sync again
            console.log(`[${new Date().toISOString()}] Match with id ${match.matchID} exists, deleting to sync again...`)
            this.delete(match.matchID)
          } else {
            console.log(`[${new Date().toISOString()}] Match with id ${match.matchID} exists, skipping...`)
            // Set the match Synched
            await this.playerMatchesService.setMatchesSynched(match.matchID)
            continue
          }
        }

        let dateString = new Date().toISOString()
        try {
          console.time(`[${dateString}] syncMatches: queryMatch ${match.matchID}`)
          const matchInfo = await this.API.MWFullMatchInfowz(match.matchID, match.platform)
          console.timeEnd(`[${dateString}] syncMatches: queryMatch ${match.matchID}`)
          matchInfo.matchID = match.matchID
          if(matchInfo.allPlayers.length > 0) {
            matchInfo.utcStartSeconds = matchInfo.allPlayers[0].utcStartSeconds

            // Set Start Date
            var startDate = new Date(0) // The 0 there is the key, which sets the date to the epoch
            startDate.setUTCSeconds(matchInfo.utcStartSeconds)
            matchInfo.date =  moment(startDate).format('MM-DD-YYYY')

            matchInfo.utcEndSeconds = matchInfo.allPlayers[0].utcEndSeconds
            matchInfo.map = matchInfo.allPlayers[0].map
            matchInfo.mode = matchInfo.allPlayers[0].mode
            matchInfo.duration = matchInfo.allPlayers[0].duration
            matchInfo.playlistName = matchInfo.allPlayers[0].playlistName
            matchInfo.version = matchInfo.allPlayers[0].version
            matchInfo.gameType = matchInfo.allPlayers[0].gameType
            matchInfo.playerCount = matchInfo.allPlayers[0].playerCount
            matchInfo.teamCount = matchInfo.allPlayers[0].teamCount
            matchInfo.rankedTeams = matchInfo.allPlayers[0].rankedTeams
            matchInfo.draw = matchInfo.allPlayers[0].draw
            matchInfo.privateMatch = matchInfo.allPlayers[0].privateMatch

            // Remove duplicate properties for each player
            for (const playerInMatch of matchInfo.allPlayers) {
              delete playerInMatch.matchID
              delete playerInMatch.utcStartSeconds
              delete playerInMatch.utcEndSeconds
              delete playerInMatch.map
              delete playerInMatch.mode
              delete playerInMatch.duration
              delete playerInMatch.playlistName
              delete playerInMatch.version
              delete playerInMatch.gameType
              delete playerInMatch.playerCount
              delete playerInMatch.teamCount
              delete playerInMatch.rankedTeams
              delete playerInMatch.draw
              delete playerInMatch.privateMatch
            }

            await this.matches.insertOne(matchInfo)
          } else {
            console.error(`Error empty match ${match.matchID} (0 players)`)
          }

        } catch(Error) {
            console.error(`Error fetching match ${match.matchID}: ${Error}`)
        }

        // Sleep to avoid errors too many requests
        await this.sleep(this.randomIntFromInterval(100, 500))

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

  async delete(matchID) {
    let result = await this.matches.deleteMany({ matchID: matchID})
    return result.deletedCount
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}

module.exports = matchesService
