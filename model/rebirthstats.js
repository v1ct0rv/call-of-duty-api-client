const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { composeWithMongoose } = require("graphql-compose-mongoose");

const RebirthStatsSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
    index: true,
  },
  platform: String,
  username: { type: String, index: true },
  teams: { type: [String], index: true },
  gamesPlayed: { type: Number, index: true },
  kills: { type: Number, index: true },
  deaths: { type: Number, index: true },
  maxKills: { type: Number, index: true },
  longestStreak: { type: Number, index: true },
  timePlayed: { type: Number, index: true },
  kdRatio: { type: Number, index: true },
  killsPerGame: { type: Number, index: true },
  killsPerMin: { type: Number, index: true },
  wins: { type: Number, index: true },
  maxKillsWin: { type: Number, index: true },
  longestStreakWin: { type: Number, index: true },
  winsPercent: { type: Number, index: true },
  gamesPerWin: { type: Number, index: true },
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
    }
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
});

const rebirthStatsTC = composeWithMongoose(mongoose.model("rebirthstats", RebirthStatsSchema))

module.exports = {
  RebirthStatsSchema: mongoose.model("rebirthstats", RebirthStatsSchema),
  RebirthStatsTC: rebirthStatsTC,
};
