import { ObjectType, ID, Field } from "type-graphql";

@ObjectType({ description: "Book Object Type " })
export class Book {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  publishedDate: string;

  @Field()
  author: string;

  @Field({ description: "Publisher in Japanese", nullable: true })
  publisher: string;
  @Field({ description: "Label", nullable: true })
  label: string;
  @Field({ nullable: true })
  summary: string;

  @Field({ nullable: true })
  //May implement a search by Author Name which would cause this to be redundant
  authorId: string;
}
