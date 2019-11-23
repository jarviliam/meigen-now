import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { Quote } from "../types/quote-types";
import { FbApp } from "../fireBase";
import { plainToClass } from "class-transformer";

@Resolver()
export class QuoteResolver {
  @Query(() => Quote || String)
  async getQuotebyId(@Arg("id") id: string): Promise<Quote> {
    return await FbApp()
      .firestore()
      .collection("quotes")
      .doc(id)
      .get()
      .then((doc: any) => {
        if (doc) {
          const quote = plainToClass(Quote, {
            id: doc.id,
            quote: doc.data().quote,
            rating: doc.data().rating,
            author: doc.data().author
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
      .firestore()
      .collection("quotes")
      .get()
      .then((document: any) => {
        const quoteArray: Array<Quote> = [];
        document.forEach((quote: any) => {
          const quoteObject = plainToClass(Quote, {
            id: quote.id,
            quote: quote.data().quote,
            rating: quote.data().rating,
            author: quote.data().author
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
    @Arg("authorName") authorName: string,
    @Arg("sourceId") sourceId: string
  ): Promise<Quote> {
    //Add Bycrypt for ID creation
    return await FbApp()
      .firestore()
      .collection("quotes")
      .add({ quote, rating, authorName, sourceId })
      .then((ref: any) => {
        const quoteObject = plainToClass(Quote, {
          quote,
          rating,
          authorName,
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

  @Mutation(() => String)
  async downVoteRating(@Arg("id") id: string): Promise<String> {
    const decrement = FbApp().firestore.FieldValue.decrement(1.0);
    const doc = FbApp()
      .firestore()
      .collection("quotes")
      .doc(id);
    if (doc) {
      doc.update({ rating: decrement });
      return `Successfully decreased rating of id : ${id}`;
    }
    return `Failed to find the document by id of ${id}`;
  }
}
