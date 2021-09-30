const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { composeWithMongoose } = require("graphql-compose-mongoose");

const BRStatsSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  platform: String,
  username: { type: String, index: true },
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
  }
});

// BRStatsSchema.virtual('br.winsPercent').get(function() {
//   //return ((this.wins*100)/this.gamesPlayed);
//   return this.br.wins
// });

const brStatsTC = composeWithMongoose(mongoose.model("brstats", BRStatsSchema))
brStatsTC.get('br').addFields({
  winsPercent: {
    type: 'Float',
    resolve: (source) => {
      // console.log('here is the source', source)
      return ((source.wins*100)/source.gamesPlayed)
    }
  },
  killsPerGame: {
    type: 'Float',
    resolve: (source) => {
      // console.log('here is the source', source)
      return source.kills/source.gamesPlayed
    }
  },
  gamesPerWin: {
    type: 'Float',
    resolve: (source) => {
      // console.log('here is the source', source)
      return source.gamesPlayed/source.wins
    }
  }
});

module.exports = {
  BRStatsSchema: mongoose.model("brstats", BRStatsSchema),
  BRStatsTC: brStatsTC,
};
