import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { User } from "@/utils/types";
import Prisma from "@/utils/api/db";
import { scryptSync, timingSafeEqual } from "crypto";
import rateLimit from "@/utils/api/rate-limit";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = Prisma.getPrisma();

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

const nextAuthOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as User;
        const user = await prisma.user.findFirst({
          where: {
            email,
          },
        });
        //Check if user with email exist
        if (!user) throw new Error("Invalid email or password");
        //Else check password
        const [salt, key] = user.password.split(":");
        const hashedBuffer = scryptSync(password, salt, 64);
        const keyBuffer = Buffer.from(key, "hex");
        const match = timingSafeEqual(hashedBuffer, keyBuffer);
        if (match)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            verified: user.verified,
          };
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
};

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  
  //Limit requests for DDOS protecton
  await limiter
    .check(res, 12, process.env.LRU_CACHE_TOKEN as string)
    .catch((_) => res.status(429).json({ error: "Rate limit exceeded" }));

  return await NextAuth(req, res, nextAuthOptions);
}
