const { ApolloServer } = require('apollo-server');
const { typeDefs } = require('./schema/type-defs');
const { resolvers } = require('./schema/resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => {
        return {
            player: 'Doroke',
            req
        };
    }
});

server.listen().then(({ url }) => {
    console.log(`APOLLO SERVER RUNNING AT ${url}`);
});
