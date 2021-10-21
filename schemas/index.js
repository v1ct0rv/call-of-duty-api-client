const { SchemaComposer } = require( 'graphql-compose');


const schemaComposer = new SchemaComposer();

const { BRStatQuery, BRStatMutation } = require ('./brstats');
const { MatchQuery, MatchMutation } = require ('./matches');
const { PlayerMatchQuery, PlayerMatchMutation } = require ('./playermatches');

schemaComposer.Query.addFields({
    ...BRStatQuery,
    ...MatchQuery,
    ...PlayerMatchQuery,
});

schemaComposer.Mutation.addFields({
    ...BRStatMutation,
    ...MatchMutation,
    ...PlayerMatchMutation,
});

module.exports = schemaComposer.buildSchema();
