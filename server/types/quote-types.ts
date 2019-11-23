import { ObjectType, Field, ID } from "type-graphql";

@ObjectType({ description: "Quote Type" })
export class Quote {
  @Field(() => ID)
  id: number;

  @Field({ description: "Actual Quote" })
  quote: string;

  @Field({ description: "Quote Rating" })
  rating: number;

  @Field({ description: "Source Material", nullable: true })
  author: string;

  @Field({ description: "Source Id", nullable: true })
  sourceId: string;
}
