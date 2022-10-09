import { NextApiRequest, NextApiResponse } from "next";
import { randomBytes, scryptSync } from "crypto";
import { Secret, sign } from "jsonwebtoken";
import sendPRMail from "@/utils/api/sendPasswordResetMail";
import Prisma from "@/utils/api/db";

const prisma = Prisma.getPrisma();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") res.status(405).json({ message: "Invalid method" });
  const { email } = req.body;
  // Check if the email exist
  const user = await prisma.user.findFirst({
    where: { email },
    select: { name: true },
  });
  if (!user) res.status(200);

  // create a password reset link
  randomBytes(256, async (err, buf) => {
    if (err) res.status(500).json(err);
    const token = sign({ email, num: buf }, process.env.JWT_SECRET as Secret, {
      expiresIn: 900,
    });
    //Add the encrypted version of this token in db
    const salt = randomBytes(14).toString("hex");
    const hashedToken = scryptSync(token, salt, 64).toString("hex");
    //Store in DB
    await prisma.resetToken.create({
      data: {
        email,
        used: false,
        token: hashedToken,
      },
    });

    const resetlink = `${
      process.env.NODE_ENV == "production"
        ? process.env.PASSWORD_RESETLINK
        : "http://localhost:3000"
    }/api/auth/resetpassword?token=${encodeURIComponent(token)}&email=${email}`;
    console.log(resetlink);
    // Send the link to the email
    sendPRMail(email, resetlink);
  });
}
