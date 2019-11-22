import "reflect-metadata";

const express = require("express");

// const graphHTTP = require('express-graphql')
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { QuoteResolver } from "./resolvers/quote-resolver";
import { AuthorResolver } from "./resolvers/author-resolver";

const main = async () => {
  const schema = await buildSchema({
    resolvers: [QuoteResolver, AuthorResolver]
  });
  const apolloServer = new ApolloServer({ schema });
  const app = express();

  apolloServer.applyMiddleware({ app });
  const port = process.env.PORT || 3000;
  app.listen(port, () =>
    console.log("Server running on 3000 port. Graphql is /graphql")
  );
};

main();


