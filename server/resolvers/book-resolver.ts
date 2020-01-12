import { FbApp } from "../fireBase";
import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { plainToClass } from "class-transformer";
import { Book } from "../types/book-types";
import { CreateBookInput } from "../inputs/book-inputs";

@Resolver()
export class BookResolver {
  //Get Query for getting a single book by Id
  @Query(() => Book)
  async getBookById(@Arg("id") id: string): Promise<Book> {
    return await FbApp()
      .firebase()
      .collection("books")
      .doc(id)
      .get()
      .then((response: any) => {
        if (response) {
          const book = plainToClass(Book, { id: response.id });
          return book;
        } else {
          return "No Book Found";
        }
      })
      .catch((error: any) => {
        console.log("Error Caught", error);
      });
  }

  //Get Query for all books in the collection
  @Query(() => [Book])
  async getAllBooks(): Promise<Array<Book>> {
    return await FbApp()
      .firestore()
      .collection("books")
      .get()
      .then((result: any) => {
        const bookArray: Array<Book> = [];
        result.forEach((book: any) => {
          //TODO: Hook up author ID connection
          let bookObject = plainToClass(Book, {
            id: book.id,
            title: book.data().title,
            author: book.data().author,
            publishedDate: book.data().publishedDate
          });
          bookArray.push(bookObject);
        });
        return bookArray;
      })
      .catch((error: any) => {
        console.log("Error found collecting all books ", error);
      });
  }

  //Get Books by Author Id
  @Query(() => [Book])
  async getBooksbyAuthor(
    @Arg("authorID") authorID: string
  ): Promise<Array<Book>> {
    return await FbApp()
      .firestore()
      .collection("books")
      .where("authorId", "==", authorID)
      .then((response: any) => {
        const bookArray: Array<Book> = [];

        response.forEach((book: any) => {
          let bookObject = plainToClass(Book, {
            id: book.id,
            title: book.data().title,
            author: book.data().author,
            publishedDate: book.data().publishedDate
          });
          bookArray.push(bookObject);
        });
        return bookArray;
      })
      .catch((error: Error) => console.log(error));
  }
  @Mutation(() => Book)
  async createBook(
    @Arg("data")
    {
      title,
      author,
      publishedDate,
      summary,
      label,
      authorId,
      publisher
    }: CreateBookInput
  ): Promise<String> {
    return await FbApp()
      .firestore()
      .collection("books")
      .add({
        title,
        author,
        publishedDate,
        summary,
        label,
        authorId,
        publisher
      })
      .then((res: any) => {
        console.log(res);
        return "Book Made";
      })
      .catch((error: any) => {
        console.log("Error making book", error);
      });
  }
}
