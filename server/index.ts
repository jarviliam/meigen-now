import "reflect-metadata";

const express = require("express");
import { ApolloServer } from "apollo-server-express";
import { makeSchema } from "./utils/makeSchema";
require("dotenv").config();
// import cookieParser from"cookie-parser";
import cookieParser = require("cookie-parser");

const main = async () => {
  const schema = await makeSchema();
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res })
  });
  const app = express();
  app.use(cookieParser());
  apolloServer.applyMiddleware({ app });
  const port = process.env.PORT || 3000;
  app.listen(port, () =>
    console.log("Server running on 3000 port. Graphql is /graphql")
  );
};

main();
