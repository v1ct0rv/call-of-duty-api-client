import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { composeWithMongoose } from "graphql-compose-mongoose";

const Last100GamesStatsSchemaDef = new Schema({
  platform: String,
  username: { type: String, index: true },
  teams: { type: [String], index: true },
  gameMode: { type: String, enum : ['br','rebirht'], default: 'br', index: true },
  kills: { type: Number, index: true },
  deaths: { type: Number, index: true },
  maxKills: { type: Number, index: true },
  longestStreak: { type: Number, index: true },
  kdRatio: { type: Number, index: true },
  killsPerGame: { type: Number, index: true },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
});

export const Last100GamesStatsTC = composeWithMongoose(mongoose.model("last100gamesstats", Last100GamesStatsSchemaDef))
export const Last100GamesStatsSchema = mongoose.model("last100gamesstats", Last100GamesStatsSchemaDef)

export default {
  Last100GamesStatsSchema,
  Last100GamesStatsTC,
};
