import { userInfoSchema } from "@/utils/validations";
import { NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "yup";
import sendVerifyMail from "@/utils/api/sendVerifyMail";
import { createVerifyToken } from "@/utils/api/jwt";
import Prisma from "@/utils/api/db";
import rateLimit from "@/utils/api/rate-limit";
import hashPassword from "@/utils/api/hashPassword";

const prisma = Prisma.getPrisma();

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Limit requests for DDOS protecton
  await limiter
    .check(res, 12, process.env.LRU_CACHE_TOKEN as string)
    .catch((_) => res.status(429).json({ error: "Rate limit exceeded" }));

  try {
    await userInfoSchema.validate(req.body);
  } catch (err) {
    res.status(403).json({ error: (err as ValidationError).errors[0] });
  }
  try {
    const { email, password, firstname, lastname } = req.body;

    //May need to verify if email exists

    //Check no user exists with the given email
    const user = await prisma.user.findFirst({
      where: { email },
      select: { email: true, id: true, name: true },
    });
    if (user?.email) {
      res
        .status(409)
        .json({ error: "User already exist. Please use a different email" });
      return;
    }
    //Send verification mail
    const token = createVerifyToken({ email, firstname, lastname });

    const verification_link = `${
      process.env.NODE_ENV == "production"
        ? process.env.PASSWORD_RESETLINK
        : "http://localhost:3000"
    }/api/auth/verify?token=${token}`;

    sendVerifyMail(email, firstname, verification_link).catch((err) => {
      console.log(err.message);
      res.status(401).json({ error: err.message });
    });
    //Create the user
    await prisma.user.create({
      data: {
        email,
        password: hashPassword(password),
        name: `${firstname} ${lastname}`,
        verified: false,
      },
    });
    res.status(200).json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
