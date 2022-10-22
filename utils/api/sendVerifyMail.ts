import Mail from 'nodemailer/lib/mailer';
import { verifyEmailHTML } from './HTML';
import { transporter } from './sendPasswordResetMail';
import config from '@/config/index';

export default async function sendVerifyMail(email: string, username: string, verification_link: string) {
    const mailOptions: Mail.Options = {
        from: config.email,
        to: email,
        subject: 'Verify your account',
        text: 'Click on this link to verify your email address',
        html: verifyEmailHTML(username, config.logo_url, verification_link)
    }
    const res = await transporter.sendMail(mailOptions);
    console.log(res)
    if (res.rejected.length) Promise.reject(new Error("Failed to send message"));
    
}