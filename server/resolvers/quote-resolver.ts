import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { Quote } from "../types/quote-types";
import { FbApp } from "../fireBase";
import { plainToClass } from "class-transformer";

@Resolver()
export class QuoteResolver {
  @Query(() => String)
  async getQuotebyId(@Arg("id") id: string): Promise<Quote> {
    return await FbApp()
      .firebase()
      .collection("quotes")
      .doc(id)
      .get()
      .then((doc: any) => {
        if (doc) {
          const quote = plainToClass(Quote, {
            id: doc.id,
            quote: doc.data().quote,
            rating: doc.data().rating,
            source: doc.data().source
          });
          return quote;
        } else {
          return "Not found";
        }
      })
      .catch((err: any) => console.log(err));
  }

  //Get All Quotes
  @Query(() => [Quote])
  async getAllQuotes(): Promise<Quote[]> {
    return await FbApp()
      .firebase()
      .collection("quotes")
      .get()
      .then((document: any) => {
        const quoteArray: Array<Quote> = [];
        document.forEach((quote: any) => {
          const quoteObject = plainToClass(Quote, {
            id: quote.id,
            quote: quote.data().quote,
            rating: quote.data().rating,
            source: quote.data().source
          });
          quoteArray.push(quoteObject);
        });
        //Map finished return final array
        return quoteArray;
      })
      .catch((err: any) => console.log(err));
  }

  //Make one quote
  @Mutation(() => Quote)
  async makeQuote(
    @Arg("quote") quote: string,
    @Arg("rating") rating: number,
    @Arg("sourceName") sourceName: string,
    @Arg("sourceId") sourceId: string
  ): Promise<Quote> {
    //Add Bycrypt for ID creation
    return await FbApp()
      .collection("quotes")
      .add({ quote, rating, sourceName, sourceId })
      .then((ref: any) => {
        const quoteObject = plainToClass(Quote, {
          quote,
          rating,
          sourceName,
          sourceId
        });
        console.log("Added Quote with Id of ", ref.id);
        return quoteObject;
      })
      .catch((err: any) => console.log(err));
  }

  //Upvote a Quote ranking Look into FieldValue increment logic
  @Mutation(() => String)
  async upVoteRating(@Arg("id") id: string): Promise<String> {
    const increment = FbApp().firestore.FieldValue.increment(1.0);
    const doc = FbApp()
      .firestore()
      .collection("quotes")
      .doc(id);
    if (doc) {
      doc.update({ rating: increment });
      return `Successfully increased rating of id: ${id}`;
    }
    return `Did not manage to find document by id of ${id}`;
  }
}
