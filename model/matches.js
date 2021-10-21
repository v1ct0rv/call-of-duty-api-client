const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { composeWithMongoose } = require("graphql-compose-mongoose");

const AllPlayersSchema = new Schema({
  utcStartSeconds: Number,
  utcEndSeconds: Number,
  map: String,
  mode: String,
  matchID: String,
  duration: Number,
  playlistName: String,
  version: Number,
  gameType: String,
  playerCount: Number,
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

const MatchesSchema = new Schema({
  matchID: { type: String , index: true },
  allPlayers: [ AllPlayersSchema ]
});

const matchesTC = composeWithMongoose(mongoose.model("matches", MatchesSchema))

module.exports = {
  MatchesSchema: mongoose.model("matches", MatchesSchema),
  MatchesTC: matchesTC,
};
