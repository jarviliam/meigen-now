import { Resolver, Query } from "type-graphql";
import { Author } from "../types/author-types";
import { FbApp } from "../fireBase";
import { plainToClass } from "class-transformer";

@Resolver()
export class AuthorResolver {
  @Query(() => [Author])
  //Getting all authors from firebase
  async getAllAuthors(): Promise<Author[]> {
    const admin = FbApp();
    const db = admin.collection("authors");
    return await db
      .get()
      .then((document: any) => {
        const AuthorArr: Array<Author> = [];
        //Loop through each document. Put info into an Author Class Object then push to array for return
        document.forEach((doc: any) => {
          const object = {
            id: doc.id,
            name: doc.data().name,
            country: doc.data().country
          };
          const newAuthor = plainToClass(Author, object);
          AuthorArr.push(newAuthor);
        });
        return AuthorArr;
      })
      .catch((err: any) => {
        console.log("Error getting documents", err);
      });
  }
}
