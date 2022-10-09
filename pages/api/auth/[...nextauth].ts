import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { User } from "@/utils/types";
import users from "@/db/users.json";

const nextAuthOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      type: "credentials",
      credentials:{},
      authorize(credentials, req) {
        const { email, password } = credentials as User;
        const user = users.find((user) => user.email == email);
        if (!user || user.password != password)
          throw new Error("Invalid email or password");

        return { id: "1", email, password };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout'
  },
};

export default NextAuth(nextAuthOptions);
