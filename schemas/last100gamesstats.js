import { Last100GamesStatsTC } from "../model/last100gamesstats.js";
import { Last100GamesStatsSchema } from "../model/last100gamesstats.js";

Last100GamesStatsTC.addResolver({
  name: "create",
  kind: "mutation",
  type: Last100GamesStatsTC.getResolver("createOne").getType(),
  args: Last100GamesStatsTC.getResolver("createOne").getArgs(),
  resolve: async ({ source, args, context, info }) => {
    const last100GamesStat = await Last100GamesStatsSchema.create(args.record);

    return {
      record: last100GamesStat,
      recordId: Last100GamesStatsTC.getRecordIdFn()(last100GamesStat),
    };
  },
});

// https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html
export const Last100GamesStatQuery = {
  last100GamesStatById: Last100GamesStatsTC.getResolver("findById"),
  last100GamesStatByIds: Last100GamesStatsTC.getResolver("findByIds"),
  last100GamesStatOne: Last100GamesStatsTC.getResolver("findOne"),
  last100GamesStatMany: Last100GamesStatsTC.getResolver("findMany"),
  last100GamesStatCount: Last100GamesStatsTC.getResolver("count"),
  last100GamesStatConnection: Last100GamesStatsTC.getResolver("connection"),
  last100GamesStatPagination: Last100GamesStatsTC.getResolver("pagination"),
};

export const Last100GamesStatMutation = {
  // last100GamesStatWithFile: Last100GamesStatsTC.getResolver("create"),
  // last100GamesStatCreateOne: Last100GamesStatsTC.getResolver("createOne"),
  // last100GamesStatCreateMany: Last100GamesStatsTC.getResolver("createMany"),
  // last100GamesStatUpdateById: Last100GamesStatsTC.getResolver("updateById"),
  // last100GamesStatUpdateOne: Last100GamesStatsTC.getResolver("updateOne"),
  // last100GamesStatUpdateMany: Last100GamesStatsTC.getResolver("updateMany"),
  // last100GamesStatRemoveById: Last100GamesStatsTC.getResolver("removeById"),
  // last100GamesStatRemoveOne: Last100GamesStatsTC.getResolver("removeOne"),
  // last100GamesStatRemoveMany: Last100GamesStatsTC.getResolver("removeMany"),
};

export default { Last100GamesStatQuery, Last100GamesStatMutation };
