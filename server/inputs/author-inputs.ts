import { InputType, Field } from "type-graphql";

//TO do add length classifiers for certain entries
@InputType()
export class AuthorInput {
  @Field()
  country: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  engName: string;

  @Field()
  birthdate: string;

  @Field({ nullable: true })
  dateOfDeath: string;

  @Field({ nullable: true })
  summary: string;
}
