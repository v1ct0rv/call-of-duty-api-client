import { SchemaComposer } from "graphql-compose";


const schemaComposer = new SchemaComposer();

import { BRStatQuery, BRStatMutation } from "./brstats.js";
import { RebirthStatQuery, RebirthStatMutation } from "./rebirthstats.js";
import { MatchQuery, MatchMutation } from "./matches.js";
import { PlayerMatchQuery, PlayerMatchMutation } from "./playermatches.js";
import { Last100GamesStatQuery, Last100GamesStatMutation } from "./last100gamesstats.js";

schemaComposer.Query.addFields({
    ...BRStatQuery,
    ...MatchQuery,
    ...PlayerMatchQuery,
    ...RebirthStatQuery,
    ...Last100GamesStatQuery,
});

schemaComposer.Mutation.addFields({
    ...BRStatMutation,
    ...MatchMutation,
    ...PlayerMatchMutation,
    ...RebirthStatMutation,
    ...Last100GamesStatMutation,
});

export default schemaComposer.buildSchema();
