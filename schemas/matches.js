import { MatchesSchema, MatchesTC } from "../model/matches.js";

MatchesTC.addResolver({
  name: "create",
  kind: "mutation",
  type: MatchesTC.getResolver("createOne").getType(),
  args: MatchesTC.getResolver("createOne").getArgs(),
  resolve: async ({ source, args, context, info }) => {
    const match = await MatchesSchema.create(args.record);

    return {
      record: match,
      recordId: MatchesTC.getRecordIdFn()(match),
    };
  },
});

// https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html
export const MatchQuery = {
  matchById: MatchesTC.getResolver("findById"),
  matchByIds: MatchesTC.getResolver("findByIds"),
  matchOne: MatchesTC.getResolver("findOne"),
  matchMany: MatchesTC.getResolver("findMany"),
  matchCount: MatchesTC.getResolver("count"),
  matchConnection: MatchesTC.getResolver("connection"),
  matchPagination: MatchesTC.getResolver("pagination"),
};

export const MatchMutation = {
  // matchWithFile: MatchesTC.getResolver("create"),
  // matchCreateOne: MatchesTC.getResolver("createOne"),
  // matchCreateMany: MatchesTC.getResolver("createMany"),
  // matchUpdateById: MatchesTC.getResolver("updateById"),
  // matchUpdateOne: MatchesTC.getResolver("updateOne"),
  // matchUpdateMany: MatchesTC.getResolver("updateMany"),
  // matchRemoveById: MatchesTC.getResolver("removeById"),
  // matchRemoveOne: MatchesTC.getResolver("removeOne"),
  // matchRemoveMany: MatchesTC.getResolver("removeMany"),
};

export default { MatchQuery, MatchMutation };
