import { JwtPayload, Secret, sign, verify } from "jsonwebtoken";

export const createVerifyToken = ({email, firstname, lastname}:{email: string, firstname:string, lastname:string}) => {
    const token = sign({email, name:  `${firstname} ${lastname}`,type: 'email-verification' }, process.env.JWT_SECRET as Secret, {
        expiresIn: process.env.MAIL_SENDER_EMAIL_VERIFICATION_EXP,
      });
      return token;
}
export const verifyVerificationToken = (token: string, callBack: Function) => {
     verify(token, process.env.JWT_SECRET as Secret, function(err, decoded) {
        if (err || (decoded as JwtPayload)?.type != 'email-verification') throw new Error(err?.message || 'Invalid token type')
        callBack(decoded);
    })
}