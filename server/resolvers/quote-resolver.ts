import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { Quote } from "../types/quote-types";
import { FbApp } from "../fireBase";
import { plainToClass } from "class-transformer";
import { CreateQuoteInputs } from "../inputs/quote-inputs";
// import { CreateArrayQuote } from "../inputs/quote-inputs";

// type QuoteT = {
//   quote: string;
//   rating: number;
//   explanation?: string;
//   author: string;
//   sourceId?: string;
// };
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
          const quoteObject = doc.data();
          quoteObject.id = doc.id;
          return quoteObject;
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
            author: quote.data().author,
            explanation: quote.data().explanation
          });
          quoteArray.push(quoteObject);
        });
        //Map finished return final array
        return quoteArray;
      })
      .catch((err: any) => console.log(err));
  }
  //Get top 10 quotes by rating
  @Query(() => [Quote])
  async getTopQuotes(): Promise<Quote[]> {
    return await FbApp()
      .firestore()
      .collection("quotes")
      .orderBy("rating")
      .limit(10)
      .get()
      .then((response: any) => {
        const quoteArray: Array<Quote> = [];
        if (response) {
          response.forEach((quote: any) => {
            let object = quote.data();
            object.id = quote.id;
            console.log(object);
            quoteArray.unshift(plainToClass(Quote, object));
          });
          return quoteArray;
        }
        return "Document not found";
      })
      .catch((error: Error) => console.log(error));
  }
  //Make one quote
  @Mutation(() => Quote)
  async makeQuote(
    @Arg("data")
    { quote, rating, author, sourceId, explanation }: CreateQuoteInputs
  ): Promise<Quote> {
    return await FbApp()
      .firestore()
      .collection("quotes")
      .add({ quote, rating, author, sourceId, explanation })
      .then((ref: any) => {
        const quoteObject = ref.data();
        quoteObject.id = ref.id;
        console.log("Added Quote with Id of ", ref.id);
        return plainToClass(Quote, quoteObject);
      })
      .catch((err: any) => console.log(err));
  }

  //Make a batch of quote inserts
  @Mutation(() => String)
  async makeBatchQuotes(@Arg("data", () => Quote) data: Quote[]) {
    const database = FbApp().firestore();
    let batch = database.batch();
    data.map(quoteEntry => {
      let quoteRef = database.collection("quotes").doc();

      batch.set(quoteRef, quoteEntry);
      console.log(quoteEntry);
    });
    return await batch
      .commit()
      .then((response: any) => {
        console.log(response);
        return "Batch was successfully written";
      })
      .catch((error: Error) => console.log(error));
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
  @Mutation(() => String)
  async addExplanation(
    @Arg("id") id: string,
    @Arg("explanation") explanation: string
  ) {
    const doc = FbApp()
      .firestore()
      .collection("quotes")
      .doc(id);

    if (doc) {
      doc.update({ explanation: explanation });
      return `Explanation successfully added to document ${doc.id}`;
    }

    return `Could not find document by id of ${id}`;
  }

  @Mutation(() => String)
  async addBookRef(@Arg("id") id: string, @Arg("sourceId") sourceId: string) {
    const doc = FbApp()
      .firestore()
      .collection("quotes")
      .doc(id);
    if (doc) {
      doc.update({ sourceId: sourceId });
      return `Source ID of ${sourceId} added to document id of ${doc.id}`;
    }
    return `Could not find document by id of ${id}`;
  }

  // @Mutation(() => String)
  // async updateQuote(
  //   @Arg("id") id: string,
  //   @Arg("updateObject") updateObject: object
  // ): Promise<String> {
  //   const doc = FbApp()
  //     .firestore()
  //     .collection("quotes")
  //     .doc(id);
  //   if (doc) {
  //     doc.update({ updateObject });
  //     return `Updated ${id} with `;
  //   }
  //   return `Failed to find the document by id of ${id}`;
  // }
}
