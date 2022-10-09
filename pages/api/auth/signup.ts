import { userInfoSchema } from "@/utils/validations";
import { NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "yup";
import { randomBytes, scryptSync } from "crypto";
import sendVerifyMail from "@/utils/api/sendVerifyMail";
import { createVerifyToken } from "@/utils/api/jwt";
import Prisma from "@/utils/api/db";

const prisma = Prisma.getPrisma();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await userInfoSchema.validate(req.body);
  } catch (err) {
    res.status(403).json((err as ValidationError).errors[0]);
  }
  try {
    const { email, password, firstname, lastname } = req.body;
    //Check no user exists with the given email
    const user = await prisma.user.findFirst({
      where: { email },
      select: { email: true, id: true, name: true },
    });
    if (user?.email) {
        res.status(409).json({ message: "User already exist. Please use a different email" });
        return;
    }
    //Send verification mail
    const token = createVerifyToken({ email, firstname, lastname });

    const verification_link = `${
      process.env.NODE_ENV == "production"
        ? process.env.PASSWORD_RESETLINK
        : "http://localhost:3000"
    }/api/auth/verify?token=${token}`;

    sendVerifyMail(email, firstname, verification_link).catch((err) =>
      console.log(err.message)
    );
    //Hash the password
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = scryptSync(password, salt, 64).toString("hex");
    //Create the user
    await prisma.user.create({
      data: {
        email,
        password: `${salt}:${hashedPassword}`,
        name: `${firstname} ${lastname}`,
        verified: false,
      },
    });
    res.status(200).json({message: 'Success'});
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
