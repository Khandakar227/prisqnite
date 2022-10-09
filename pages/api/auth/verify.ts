import { verifyVerificationToken } from '@/utils/api/jwt';
import { verify, JwtPayload } from 'jsonwebtoken';
import Prisma from '@/utils/api/db';
import {NextApiRequest, NextApiResponse} from 'next'

const prisma = Prisma.getPrisma();
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method != 'GET') res.status(405).json({message: 'invalid method'});
    try {
        const {token} = req.query;
        verifyVerificationToken(decodeURIComponent(token as string), async (decoded:JwtPayload)=> {
            console.log(decoded);
            await prisma.user.update({where: {email: decoded.email}, data: {verified: true}}).catch(err=> res.status(500));
            res.redirect('/');
        })
    } catch (error) {
        res.status(500).json({message: 'Something went wrong.'})
    }
}