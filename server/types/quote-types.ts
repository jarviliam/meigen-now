import { ObjectType, Field, ID, InputType } from "type-graphql";

// Do to issues with getting Batch uploads working. Id has to be temporarily set to nullable because,
// it is impossible to set and ID from server side when Firebase sets it for us automatically.
@ObjectType({ description: "Quote Type" })
@InputType("QuoteInput")
export class Quote {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field({ description: "Actual Quote" })
  quote: string;

  @Field({ description: "Quote Rating" })
  rating: number;
  @Field({ description: "Quote explanation", nullable: true })
  explanation: string;
  @Field({ description: "Author Name", nullable: true })
  author: string;
  @Field({ description: "Author ID", nullable: true })
  authorID: string;
  @Field({ description: "Source Id", nullable: true })
  sourceId: string;
}
