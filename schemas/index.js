const { SchemaComposer } = require( 'graphql-compose');


const schemaComposer = new SchemaComposer();

const { BRStatQuery, BRStatMutation } = require ('./brstats');
const { RebirthStatQuery, RebirthStatMutation } = require ('./rebirthstats');
const { MatchQuery, MatchMutation } = require ('./matches');
const { PlayerMatchQuery, PlayerMatchMutation } = require ('./playermatches');
const { Last100GamesStatQuery, Last100GamesStatMutation } = require ('./last100gamesstats');

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

module.exports = schemaComposer.buildSchema();
