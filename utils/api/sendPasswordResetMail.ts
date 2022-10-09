import {createTransport} from 'nodemailer';
import config from '@/config/index';
import {passwordResetHTML} from './HTML';

export const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_SENDER_EMAIL,
        pass: process.env.MAIL_SENDER_PASS
    }
})

const sendPRMail = (email:string, link:string) => {
   const  mailOptions = {
        from: config.email,
        to: email,
        subject: 'Reset your password',
        html: passwordResetHTML(email, config.logo_url, link)
      };
      transporter.sendMail(mailOptions, (err, info)=>{
        console.log(info);
        if (err) throw new Error(err.message);
      });
      
}

export default sendPRMail;