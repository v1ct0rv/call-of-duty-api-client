const { SchemaComposer } = require( 'graphql-compose');


const schemaComposer = new SchemaComposer();

const { BRStatQuery, BRStatMutation } = require ('./brstats');
const { RebirthStatQuery, RebirthStatMutation } = require ('./rebirthstats');
const { MatchQuery, MatchMutation } = require ('./matches');
const { PlayerMatchQuery, PlayerMatchMutation } = require ('./playermatches');

schemaComposer.Query.addFields({
    ...BRStatQuery,
    ...MatchQuery,
    ...PlayerMatchQuery,
    ...RebirthStatQuery,
});

schemaComposer.Mutation.addFields({
    ...BRStatMutation,
    ...MatchMutation,
    ...PlayerMatchMutation,
    ...RebirthStatMutation,
});

module.exports = schemaComposer.buildSchema();
