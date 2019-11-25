import { ObjectType, Field, ID } from "type-graphql";

/*
Author Should have a few elements
Unique Id, Name, English Name, Birthdate, DeathDate(optional), Country of Birth?
Small description of person as well

*/

@ObjectType({ description: "Author Object" })
export class Author {
  @Field(() => ID)
  id: string;

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
