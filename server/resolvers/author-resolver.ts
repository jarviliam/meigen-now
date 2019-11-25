import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { Author } from "../types/author-types";
import { FbApp } from "../fireBase";
import { plainToClass } from "class-transformer";
import { AuthorInput } from "../inputs/author-inputs";

@Resolver()
export class AuthorResolver {
  @Query(() => [Author])
  //Getting all authors from firebase
  async getAllAuthors(): Promise<Author[]> {
    const admin = FbApp().firestore();
    const db = admin.collection("authors");
    return await db
      .get()
      .then((document: any) => {
        const AuthorArr: Array<Author> = [];
        //Loop through each document. Put info into an Author Class Object then push to array for return
        document.forEach((doc: any) => {
          let authorObject = doc.data();
          authorObject.id = doc.id;
          const newAuthor = plainToClass(Author, authorObject);
          AuthorArr.push(newAuthor);
        });
        return AuthorArr;
      })
      .catch((err: any) => {
        console.log("Error getting documents", err);
      });
  }
  //Get a specific author by ID
  @Query(() => Author)
  async getAuthor(@Arg("id") id: string): Promise<Author> {
    return await FbApp()
      .firestore()
      .collection("authors")
      .doc(id)
      .get()
      .then((doc: any) => {
        if (doc) {
          const authorObject = doc.data();
          authorObject.id = doc.id;
          const author = plainToClass(Author, authorObject);
          return author;
        } else {
          return "Not Found";
        }
      })
      .catch((err: any) => console.log(err));
  }

  @Mutation(() => Author)
  async createAuthor(
    @Arg("data")
    { name, country, birthdate, engName, dateOfDeath, summary }: AuthorInput
  ): Promise<String> {
    let test = { name, country, birthdate, engName, dateOfDeath, summary };
    console.log(test);
    const db = FbApp()
      .firestore()
      .collection("authors");
    return await db
      .add({ name, country, birthdate, engName, dateOfDeath, summary })
      .then((response: any) => {
        //Can probably be switched with just a confirmation string as a return as the object does not need to be presented back
        const authorObject = plainToClass(Author, {
          name,
          country,
          id: response.id
        });
        return authorObject;
      })
      .catch((error: any) => {
        console.log("Error making an Author object ", error);
      });
  }
}
