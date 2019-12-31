import { ObjectType, ID, Field } from "type-graphql";

@ObjectType({ description: "User Model" })
export class User {
  @Field(() => ID)
  id: string;

  @Field({ description: "UserName" })
  username: string;

  @Field({ description: "password" })
  password: string;
}
