'use strict';

const express = require('express')
const graphqlHTTP = require('express-graphql')

const schema = require('./graphql')
const connectMongo = require('./mongo-connector')

const start = async () => {
  const db = await connectMongo()
  const app = express()

  // GraphqQL server route
  app.use('/graphql', graphqlHTTP(req => ({
    schema,
    pretty: true,
    graphiql: true,
    context: {
      db
    }
  })))

  // start server
  const PORT = process.env.PORT || 8080
  const server = app.listen(PORT, () => {
    console.log(`Listening at port ${server.address().port}, visit http://localhost:${server.address().port}/graphql`);
  })
}

start()
