const nodemailer = require('nodemailer')
require('dotenv').config()

let serverEmailAccount = process.env.EMAIL_ACCOUNT

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: serverEmailAccount,
        pass: process.env.EMAIL_PASSWORD,
    }
})

let mailOptions =
{
    from: 'wup',
    to: 'Remitente',
    subject: 'Remitente',
    text: 'Remitente',
}

sendUserPasswordEmail = function(user, password){
    let mailOptions =
    {
        from: serverEmailAccount,
        to: user.email,
        subject: 'Password Changed',
        text: `Your password has been changed! Please enter temporary password to access the page.\nNote that this password will expire soon. \ntemporary password: ${password}`,
    }

    transporter.sendMail(mailOptions, function(error, info){
        if(!error)
            return true
        console.error(error)
        return false
    })
}

sendUserVerificationEmail = function(user, code){
    let mailOptions =
    {
        from: serverEmailAccount,
        to: user.email,
        subject: 'Verification Code',
        text: `Please enter temporary verification code to enable your account\nVerification Code: ${code}`,
    }

    transporter.sendMail(mailOptions, function(error, info){
        if(!error)
            return true
        console.error(error)
        return false
    })
}

module.exports = {sendPasswordEmail}