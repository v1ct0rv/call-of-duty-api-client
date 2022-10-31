import { PlayerMatchesSchema, PlayerMatchesTC } from "../model/playermatches.js";

PlayerMatchesTC.addResolver({
  name: "create",
  kind: "mutation",
  type: PlayerMatchesTC.getResolver("createOne").getType(),
  args: PlayerMatchesTC.getResolver("createOne").getArgs(),
  resolve: async ({ source, args, context, info }) => {
    const match = await PlayerMatchesSchema.create(args.record);

    return {
      record: match,
      recordId: PlayerMatchesTC.getRecordIdFn()(match),
    };
  },
});

// https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html
export const PlayerMatchQuery = {
  playerMatchById: PlayerMatchesTC.getResolver("findById"),
  playerMatchByIds: PlayerMatchesTC.getResolver("findByIds"),
  playerMatchOne: PlayerMatchesTC.getResolver("findOne"),
  playerMatchMany: PlayerMatchesTC.getResolver("findMany"),
  playerMatchCount: PlayerMatchesTC.getResolver("count"),
  playerMatchConnection: PlayerMatchesTC.getResolver("connection"),
  playerMatchPagination: PlayerMatchesTC.getResolver("pagination"),
};

export const PlayerMatchMutation = {
  // matchWithFile: PlayerMatchesTC.getResolver("create"),
  // matchCreateOne: PlayerMatchesTC.getResolver("createOne"),
  // matchCreateMany: PlayerMatchesTC.getResolver("createMany"),
  // matchUpdateById: PlayerMatchesTC.getResolver("updateById"),
  // matchUpdateOne: PlayerMatchesTC.getResolver("updateOne"),
  // matchUpdateMany: PlayerMatchesTC.getResolver("updateMany"),
  // matchRemoveById: PlayerMatchesTC.getResolver("removeById"),
  // matchRemoveOne: PlayerMatchesTC.getResolver("removeOne"),
  // matchRemoveMany: PlayerMatchesTC.getResolver("removeMany"),
};

export default { PlayerMatchQuery, PlayerMatchMutation };
