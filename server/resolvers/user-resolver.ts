import { Resolver, Arg, Mutation, ObjectType, Field, Ctx } from "type-graphql";
// import { User } from "../types/user-types";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { FbApp } from "../fireBase";
import { IContext } from "../types/context-types";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@ObjectType()
class RegisterResponse {
  @Field()
  message: string;
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
    if (!user) {
      throw new Error("user not found");
    }
    const validity = await compare(password, user.docs[0].data().password);
    if (!validity) {
      throw new Error("user wrong");
    }
    //Send Back Cookie with Response
    res.cookie(
      "jid",
      sign({ userId: user.docs[0].id }, process.env.COOKIE_SECRET!, {
        expiresIn: "10m"
      }),
      { httpOnly: true }
    );
    return {
      accessToken: sign({ userId: user.docs[0].id }, process.env.SECRET_KEY!, {
        expiresIn: "5m"
      })
    };
  }
  //Might remove ID field and just use username if its only one person
  @Mutation(() => RegisterResponse)
  async register(
    @Arg("username") username: string,
    @Arg("password") password: string
  ) {
    const hashed = await hash(password, 12);
    await FbApp()
      .firestore()
      .collection("users")
      .add({ username, password: hashed })
      .then((response: any) => {
        console.log(response);
        return {
          message: "Successful"
        };
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }
}
