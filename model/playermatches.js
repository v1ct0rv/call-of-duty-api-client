import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { composeWithMongoose } from "graphql-compose-mongoose";

const PlayerMatchesSchemaDef = new Schema({
  matchID: { type: String , index: true },
  platform: String,
  username: { type: String, index: true },
  duration: Number,
  lastUpdate: Date,
  map: String,
  gameType: String,
  mode: String,
  playerCount: Number,
  playlistName: String,
  privateMatch: Boolean,
  rankedTeams: { type: "Mixed"},
  sync: Boolean,
  teamCount: Number,
  utcEndSeconds: { type: Number },
  utcStartSeconds: { type: Number, index: true },
  version: Number,
  player: {
    team: String,
    rank: String,
    uno: String,
    clantag: String,
  },
  playerStats: {
    kills: { type: Number, index: true },
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
    kdRatio: { type: Number, index: true },
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
    longestStreak: { type: Number, index: true },
    teamPlacement: Number,
    damageDone: Number,
    damageTaken: Number
  },
});

export const PlayerMatchesTC = composeWithMongoose(mongoose.model("playermatches", PlayerMatchesSchemaDef))
export const PlayerMatchesSchema = mongoose.model("playermatches", PlayerMatchesSchemaDef)

export default {
  PlayerMatchesSchema,
  PlayerMatchesTC,
};
