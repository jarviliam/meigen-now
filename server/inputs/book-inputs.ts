import { InputType, Field } from "type-graphql";

@InputType()
export class CreateBookInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  publishedDate: string;

  @Field()
  author: string;

  @Field({ nullable: true })
  summary: string;
  @Field({ description: "Publisher in Japanese", nullable: true })
  publisher: string;
  @Field({ description: "Label", nullable: true })
  label: string;
  @Field({ nullable: true })
  //May implement a search by Author Name which would cause this to be redundant
  authorId: string;
}
