import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { composeWithMongoose } from "graphql-compose-mongoose";

const AllPlayersSchema = new Schema({
  playerStats: {
    kills: Number,
    deaths: Number,
    kdRatio: Number,
    rank: Number,
    longestStreak: Number,
    gulagDeaths: Number,
    damageDone: Number,
    damageTaken: Number
  },
  player: {
    team: String,
    rank: Number,
    username: String,
    clantag: String,
  },
})

const MatchesSchemaDef = new Schema({
  matchID: { type: String , index: true },
  utcStartSeconds: Number,
  utcEndSeconds: Number,
  map: String,
  mode: String,
  duration: Number,
  playlistName: String,
  version: Number,
  gameType: String,
  playerCount: Number,
  teamCount: Number,
  rankedTeams: { type: "Mixed"},
  draw: Boolean,
  privateMatch: Boolean,
  allPlayers: [ AllPlayersSchema ]
});

export const MatchesSchema = mongoose.model("matches", MatchesSchemaDef)

export const MatchesTC = composeWithMongoose(mongoose.model("matches", MatchesSchemaDef))

export default {
  MatchesSchema,
  MatchesTC,
};
