import { ObjectType, Field, ID } from "type-graphql";

@ObjectType({ description: "Author Object" })
export class Author {
  @Field(() => ID)
  id: string;

  @Field()
  country: string;

  @Field()
  name: string;
}
