const { ApolloServer } = require('apollo-server');
const resolvers = require('./graphql/resolvers.js')
const typeDefs = require('./graphql/typeDefs')
const { sequelize } = require('./models')
const contextMiddleware = require('./util/contextMiddleware')
const server = new ApolloServer({
 typeDefs,
 resolvers,
 context: contextMiddleware /*middleware*/
});

server.listen().then(({ url }) => {
 console.log(`🚀 Server ready at ${url}`);
 sequelize.authenticate().then(() => console.log('mysql database connect...')).catch(err => console.log(err))
});