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

const PORT = 4001;

server.listen(PORT).then(({ url }) => {
    console.log(`APOLLO SERVER RUNNING AT ${url}`);
});
