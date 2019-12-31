import { Resolver, Arg, Mutation, ObjectType, Field, Ctx } from "type-graphql";
// import { User } from "../types/user-types";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { FbApp } from "../fireBase";
import { IContext } from "../types/context-types";

// @InputType()
// class UserType {
//     @Field()
// }

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => LoginResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { res }: IContext
  ): Promise<LoginResponse> {
    const user = await FbApp()
      .firestore()
      .collection("users")
      .where("username", "==", username)
      .get();
    // console.log(response.docs[0].data());
    if (!user) {
      throw new Error("user not found");
    }
    const validity = await compare(password, user.docs[0].data().password);
    console.log(validity);
    console.log(user.docs[0].data().password);
    if (!validity) {
      throw new Error("user wrong");
    }
    res.cookie(
      "jid",
      sign({ userId: "test" }, process.env.COOKIE_SECRET!, {
        expiresIn: "10m"
      }),
      { httpOnly: true }
    );
    console.log("coookie");
    console.log(process.env.COOKIE_SECRET);
    return {
      accessToken: sign({ userId: "test" }, process.env.SECRET_KEY!, {
        expiresIn: "5m"
      })
    };
  }
  //Might remove ID field and just use username if its only one person
  @Mutation(() => String)
  async register(
    @Arg("id") id: String,
    @Arg("username") username: string,
    @Arg("password") password: string
  ) {
    const hashed = await hash(password, process.env.SECRET_KEY!);
    console.log(process.env.SECRET_KEY);
    console.log(hashed);
    try {
      await FbApp()
        .firebase()
        .collection("users")
        .add({ username, hashed });
    } catch (error) {
      console.log(error);
    }
  }
}
