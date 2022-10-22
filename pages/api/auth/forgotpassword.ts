import { NextApiRequest, NextApiResponse } from "next";
import { randomBytes } from "crypto";
import sendPRMail from "@/utils/api/sendPasswordResetMail";
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
  if (req.method != "POST") res.status(405).json({ error: "Invalid method" });
  try {
    
    //Limit user sign up for DDOS protecton
    await limiter
    .check(res, 12, process.env.LRU_CACHE_TOKEN as string)
    .catch((_) => res.status(429).json({ error: "Rate limit exceeded" }));
 
   const { email } = req.body;
   // Check if the email exist
   const user = await prisma.user.findFirst({
     where: { email },
     select: { email: true },
   });
   if (!user) res.status(200);
 
   // create a password reset link
   randomBytes(256, async (err, buf) => {
     if (err) res.status(500).json(err);
     const token = buf.toString('hex');
     //Store in DB
     await prisma.resetToken.upsert({
      where: {
        email,
      },
      update: {
        used: false,
        token: hashPassword(token),
        expiresIn: (Date.now() + 1000*60*120).toString()
      },
      create: {
        email,
        used: false,
        token: hashPassword(token),
        expiresIn: (Date.now() + 1000*60*120).toString()
      },
     });
     const urlParams = new URLSearchParams({ token, email });
    
     const resetlink = `${
       process.env.NODE_ENV == "production"
         ? process.env.PASSWORD_RESETLINK
         : "http://localhost:3000"
     }/auth/resetpassword?${urlParams.toString()}`;
     console.log(resetlink);
     // Send the link to the email
     sendPRMail(email, resetlink);
    });
    res.status(200).json({message: "Success"});
  } catch (error) {
      console.log(error)
      res.status(500).json({error: "Failed"});
  }
}
