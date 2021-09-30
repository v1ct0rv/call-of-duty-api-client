const { SchemaComposer } = require( 'graphql-compose');


const schemaComposer = new SchemaComposer();

const { BRStatQuery, BRStatMutation } =require ('./brstats');

schemaComposer.Query.addFields({
    ...BRStatQuery,
});

schemaComposer.Mutation.addFields({
    ...BRStatMutation,
});

module.exports = schemaComposer.buildSchema();
