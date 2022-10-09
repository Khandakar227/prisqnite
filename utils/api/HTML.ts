const passwordResetHTML = (email:string, logo_url: string, reset_link: string) => {
    return `
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <style>
        *{line-height: 1.15;-webkit-text-size-adjust: 100%;text-size-adjust: 100%;}div {text-align: -webkit-auto; max-width: 500px; margin: 0 auto;} img{max-width: 110px; height: auto;} button {border: none; padding: 0.75rem 1rem;text-decoration: none;color: black;font-weight: bolder;background-color: springgreen;border-radius: 5px;} [type="button"] {appearance: button;} a {text-decoration: none; color: black; font-size: 1rem;}</style>
    </head>
    <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0">
        <center>
        <img src="${logo_url}" alt="Brand_logo">
        <h1>Password Reset</h1>
        <div>
            <p> Someone recently requested that the password be reset for ${email} </p>
            <p>To reset your password please click this button:</p>
        </div>
        <button><a href="${reset_link}" type="button">Reset Password</a></button>
        <p>If you did not request for a password reset please ignore this mail</p>
        </center>
    </body>
</html>
`
}

const verifyEmailHTML = ( username: string, logo_url: string, verification_link: string) => {
    return `
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <style type="text/css">
        *{line-height: 1.15;-webkit-text-size-adjust: 100%;text-size-adjust: 100%;}body{width:100% !important;}div {text-align: -webkit-auto; max-width: 500px; margin: 0 auto;} img{max-width: 110px; height: auto;} button {border: none; padding: 0.75rem 1rem;text-decoration: none;color: black;font-weight: bolder;background-color: springgreen;border-radius: 5px;} [type="button"] {appearance: button;} a {text-decoration: none; color: black; font-size: 1rem;}
        </style>
    </head>

    <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0">
        <center>
            <img src="${logo_url}" alt="Brand_logo">
            <h1>Email Verification</h1>
            <div>
                <p> Hi ${username}, </p>
                <p>Please click on this button to verify your email address to complete your registration.</p>
                </div>
                <button><a href="${verification_link}" type="button" >Verify your Email</a></button>
        </center>
    </body>
</html>
`
}
export {passwordResetHTML, verifyEmailHTML};