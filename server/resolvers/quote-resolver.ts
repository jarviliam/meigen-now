import { Resolver, Query, Arg } from "type-graphql";
// import {Quote} from '../types/quote-types'

@Resolver()
export class QuoteResolver {
  @Query(() => String)
  async helloWorld() {
    return "hello world";
  }
  @Query(() => String)
  async testQuote(
    @Arg("id") id: string,
    @Arg("quote") quote: string,
    @Arg("rating") rating: number
  ) {
    // const quotes = new Quote(id, )
    console.log(id, rating);
    return quote;
  }
}
