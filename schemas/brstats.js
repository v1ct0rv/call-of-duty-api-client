const { BRStatsTC } = require("../model/brstats");
const { BRStatsSchema } = require("../model/brstats");

BRStatsTC.addResolver({
  name: "create",
  kind: "mutation",
  type: BRStatsTC.getResolver("createOne").getType(),
  args: BRStatsTC.getResolver("createOne").getArgs(),
  resolve: async ({ source, args, context, info }) => {
    const brStat = await BRStatsSchema.create(args.record);

    return {
      record: brStat,
      recordId: BRStatsTC.getRecordIdFn()(brStat),
    };
  },
});

// https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html
const BRStatQuery = {
  brStatById: BRStatsTC.getResolver("findById"),
  brStatByIds: BRStatsTC.getResolver("findByIds"),
  brStatOne: BRStatsTC.getResolver("findOne"),
  brStatMany: BRStatsTC.getResolver("findMany"),
  brStatCount: BRStatsTC.getResolver("count"),
  brStatConnection: BRStatsTC.getResolver("connection"),
  brStatPagination: BRStatsTC.getResolver("pagination"),
};

const BRStatMutation = {
  // brStatWithFile: BRStatsTC.getResolver("create"),
  // brStatCreateOne: BRStatsTC.getResolver("createOne"),
  // brStatCreateMany: BRStatsTC.getResolver("createMany"),
  // brStatUpdateById: BRStatsTC.getResolver("updateById"),
  // brStatUpdateOne: BRStatsTC.getResolver("updateOne"),
  // brStatUpdateMany: BRStatsTC.getResolver("updateMany"),
  // brStatRemoveById: BRStatsTC.getResolver("removeById"),
  // brStatRemoveOne: BRStatsTC.getResolver("removeOne"),
  // brStatRemoveMany: BRStatsTC.getResolver("removeMany"),
};

module.exports = { BRStatQuery: BRStatQuery, BRStatMutation: BRStatMutation };
