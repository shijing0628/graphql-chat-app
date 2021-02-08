const { ApolloServer } = require('apollo-server');
const resolvers = require('./graphql/resolvers.js')
const typeDefs = require('./graphql/typeDefs')
const { sequelize } = require('./models')

const server = new ApolloServer({
 typeDefs,
 resolvers,
 context: (ctx) => ctx
});

server.listen().then(({ url }) => {
 console.log(`🚀 Server ready at ${url}`);
 sequelize.authenticate().then(() => console.log('mysql database connect...')).catch(err => console.log(err))
});