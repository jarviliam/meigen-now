import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { Quote } from "../types/quote-types";
import { FbApp } from "server/fireBase";
import { plainToClass } from "class-transformer";

@Resolver()
export class QuoteResolver {
  @Query(() => String)
  async getQuotebyId(@Arg("id") id: string): Promise<Quote> {
    return await FbApp()
      .collection("quotes")
      .doc(id)
      .get()
      .then((doc: any) => {
        if (doc) {
          const quote = plainToClass(Quote, {
            id: doc.id,
            quote: doc.data().quote,
            rating: doc.data().rating,
            source : doc.data().source
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
      .collection("quotes")
      .get()
      .then((document: any) => {
        const quoteArray: Array<Quote> = [];
        document.map((quote: any) => {
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
   @Arg("sourceId") sourceId: string,
 ) : Promise<Quote> {
   //Add Bycrypt for ID creation
    return await FbApp()
    .collection('quotes')
    .add({quote,rating,sourceName,sourceId})
    .then((ref : any) => { 
      const quoteObject = plainToClass(Quote,{quote,rating,sourceName,sourceId})
      console.log('Added Quote with Id of ', ref.id)
      return quoteObject
    })
    .catch((err : any) => console.log(err))
 }

//Upvote a Quote ranking Look into FieldValue increment logic
 @Mutation(()=> Number)
 async upVoteRating(@Arg('id') id: string) : Promise<String>
 {
  return await FbApp()
  .collection('quotes').doc(id)
  .update({rating: FbApp().FieldValue.increment(1)})
 }


}