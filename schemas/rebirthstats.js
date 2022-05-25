const { RebirthStatsTC } = require("../model/rebirthstats");
const { RebirthStatsSchema } = require("../model/rebirthstats");

RebirthStatsTC.addResolver({
  name: "create",
  kind: "mutation",
  type: RebirthStatsTC.getResolver("createOne").getType(),
  args: RebirthStatsTC.getResolver("createOne").getArgs(),
  resolve: async ({ source, args, context, info }) => {
    const rebirthStat = await RebirthStatsSchema.create(args.record);

    return {
      record: rebirthStat,
      recordId: RebirthStatsTC.getRecordIdFn()(rebirthStat),
    };
  },
});

// https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html
const RebirthStatQuery = {
  rebirthStatById: RebirthStatsTC.getResolver("findById"),
  rebirthStatByIds: RebirthStatsTC.getResolver("findByIds"),
  rebirthStatOne: RebirthStatsTC.getResolver("findOne"),
  rebirthStatMany: RebirthStatsTC.getResolver("findMany"),
  rebirthStatCount: RebirthStatsTC.getResolver("count"),
  rebirthStatConnection: RebirthStatsTC.getResolver("connection"),
  rebirthStatPagination: RebirthStatsTC.getResolver("pagination"),
};

const RebirthStatMutation = {
  // rebirthStatWithFile: RebirthStatsTC.getResolver("create"),
  // rebirthStatCreateOne: RebirthStatsTC.getResolver("createOne"),
  // rebirthStatCreateMany: RebirthStatsTC.getResolver("createMany"),
  // rebirthStatUpdateById: RebirthStatsTC.getResolver("updateById"),
  // rebirthStatUpdateOne: RebirthStatsTC.getResolver("updateOne"),
  // rebirthStatUpdateMany: RebirthStatsTC.getResolver("updateMany"),
  // rebirthStatRemoveById: RebirthStatsTC.getResolver("removeById"),
  // rebirthStatRemoveOne: RebirthStatsTC.getResolver("removeOne"),
  // rebirthStatRemoveMany: RebirthStatsTC.getResolver("removeMany"),
};

module.exports = { RebirthStatQuery: RebirthStatQuery, RebirthStatMutation: RebirthStatMutation };
