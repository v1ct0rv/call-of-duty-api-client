import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { composeWithMongoose } from "graphql-compose-mongoose";

const BRStatsSchemaDef = new Schema({
  date: {
    type: Date,
    default: Date.now,
    index: true,
  },
  platform: String,
  username: { type: String, index: true },
  teams: { type: [String], index: true },
  br: {
    wins: { type: Number, index: true },
    kills: { type: Number, index: true },
    deaths: { type: Number, index: true },
    kdRatio: { type: Number, index: true },
    timePlayed: { type: Number, index: true },
    gamesPlayed: { type: Number, index: true },
    downs: { type: Number, index: true },
    revives: { type: Number, index: true },
    scorePerMinute: { type: Number, index: true },
    topFive: { type: Number, index: true },
    topTen: { type: Number, index: true },
    topTwentyFive: { type: Number, index: true },
    winsPercent: { type: Number, index: true },
    killsPerGame: { type: Number, index: true },
    gamesPerWin: { type: Number, index: true },
    killsPerMin: { type: Number, index: true },
    maxKills: { type: Number, index: true },
    longestStreak: { type: Number, index: true },
    maxKillsWin: { type: Number, index: true },
    longestStreakWin: { type: Number, index: true },
    maxWinsInDayDate: { type: String },
    maxWinsInDayCount: { type: Number },
    winIsWin: { type: Number, index: true },
    lastWinIsWinMatchId: { type: String },
    lastWinIsWinDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    lastWin: {
      matchID: { type: String },
      date: {
        type: Date,
        default: Date.now,
        index: true,
      },
      utcStartSeconds: { type: Number },
      utcEndSeconds: { type: Number },
      playerStats: {
        kills: Number,
        medalXp: Number,
        objectiveLastStandKill: Number,
        matchXp: Number,
        scoreXp: Number,
        wallBangs: Number,
        score: Number,
        totalXp: Number,
        headshots: Number,
        assists: Number,
        challengeXp: Number,
        rank: Number,
        scorePerMinute: Number,
        distanceTraveled: Number,
        teamSurvivalTime: Number,
        deaths: Number,
        kdRatio: Number,
        objectiveBrDownEnemyCircle1: Number,
        objectiveBrMissionPickupTablet: Number,
        bonusXp: Number,
        objectiveBrKioskBuy: Number,
        gulagDeaths: Number,
        timePlayed: Number,
        executions: Number,
        gulagKills: Number,
        nearmisses: Number,
        objectiveBrCacheOpen: Number,
        percentTimeMoving: Number,
        miscXp: Number,
        longestStreak: Number,
        teamPlacement: Number,
        damageDone: Number,
        damageTaken: Number
      },
    },
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
})

// BRStatsSchema.virtual('br.winsPercent').get(function() {
//   //return ((this.wins*100)/this.gamesPlayed);
//   return this.br.wins
// });

// Custom calculated stats
// brStatsTC.get('br').addFields({
//   winsPercent: {
//     type: 'Float',
//     resolve: (source) => {
//       // console.log('here is the source', source)
//       return ((source.wins*100)/source.gamesPlayed)
//     }
//   },
//   killsPerGame: {
//     type: 'Float',
//     resolve: (source) => {
//       // console.log('here is the source', source)
//       return source.kills/source.gamesPlayed
//     }
//   },
//   gamesPerWin: {
//     type: 'Float',
//     resolve: (source) => {
//       // console.log('here is the source', source)
//       return source.gamesPlayed/source.wins
//     }
//   }
// });

export const BRStatsSchema = mongoose.model("brstats", BRStatsSchemaDef)

export const BRStatsTC = composeWithMongoose(mongoose.model("brstats", BRStatsSchemaDef))

export default {
  BRStatsSchema,
  BRStatsTC,
};
