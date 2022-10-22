import { NextApiRequest, NextApiResponse } from "next";
import Prisma from "@/utils/api/db";
import { scryptSync, timingSafeEqual } from "crypto";
import hashPassword from "@/utils/api/hashPassword";

const prisma = Prisma.getPrisma();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") res.status(405).json({ error: "Invalid method" });
  try {
    const { token, email, password } = req.body;

    if (!token || !email) {
        res.status(400).json({ error: "No token or email found" });
        return;
    }

    const resetToken = await prisma.resetToken.findUnique({
      where: { email: email as string },
    });
    // If no token found for the email or token was used through error
    if (!resetToken || resetToken.used) {
      console.log("No token or token was used");
      res.status(400).json({ error: "Invalid token or email" });
      return;
    }
    //Validate the token
    const [salt, key] = (resetToken?.token as string).split(":");
    console.log(salt, key);
    if (!salt || !key) {
      console.log("Invalid token");
      res.status(400).json({ error: "Invalid token or email" });
      return;
    }
    const hashedBuffer = scryptSync(token as string, salt, 64);
    const keyBuffer = Buffer.from(key, "hex");
    const match = timingSafeEqual(hashedBuffer, keyBuffer);

    //Check if matched
    if (!match) {
      console.log("Token does not match");
      res.status(400).json({ error: "Invalid token or email" });
      return;
    }
    //Check if token expired
    if (
      !resetToken?.expiresIn ||
      Date.now() - parseInt(resetToken?.expiresIn) > 0
    ) {
      console.log("Token expired");
      res.status(400).json({ error: "Invalid token or email" });
      return;
    }
    //Mark reset token as used
    await prisma.resetToken.update({
      where: { email: email as string },
      data: {
        used: true,
      },
    });

    await prisma.user.update({
      where: { email: email as string },
      data: {
        password: hashPassword(password as string),
      },
    });
    res.status(200).json({ message: "Password changed" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong." });
  }
}
