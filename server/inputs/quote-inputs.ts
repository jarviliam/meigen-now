import { InputType, Field } from "type-graphql";

@InputType()
export class CreateQuoteInputs {
  @Field({ description: "Actual Quote" })
  quote: string;

  @Field({ description: "Quote Rating" })
  rating: number;
  @Field({ description: "Quote explanation", nullable: true })
  explanation: string;
  @Field({ description: "Source Material", nullable: true })
  author: string;

  @Field({ description: "Source Id", nullable: true })
  sourceId: string;
}
