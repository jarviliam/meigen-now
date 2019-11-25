import { QuoteResolver } from "../resolvers/quote-resolver";
import { AuthorResolver } from "../resolvers/author-resolver";
import { BookResolver } from "../resolvers/book-resolver";
import { buildSchema } from "type-graphql";

export const makeSchema = () =>
  buildSchema({
    resolvers: [QuoteResolver, AuthorResolver, BookResolver]
  });
