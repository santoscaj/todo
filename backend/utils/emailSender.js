const nodemailer = require('nodemailer')
const fs = require('fs')
const handlebars = require('handlebars')
require('dotenv').config()

const TEMP_PASS_TEMPLATE = __dirname+'/tempPass.html'
const EMAIL_VERIFICATION_TEMPLATE = __dirname+'/emailVerification.html'

let serverEmailAccount = process.env.EMAIL_ACCOUNT

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: serverEmailAccount,
        pass: process.env.EMAIL_PASSWORD,
    }
})

function emailOptions(subject, email){
    return {
        from: serverEmailAccount,
        to: email,
        subject
    }
}

function sendEmail(options){
    transporter.sendMail(options, (error, info) =>{
        if(!error) return true
        console.error(error)
    })
}

function configureEmail(fileToRead, subject, email, variables){
    let options = emailOptions(subject, email)
    
    fs.readFile(TEMP_PASS_TEMPLATE, {encoding:'utf-8'}, (err, data)=>{
        if(err) console.error(err)
        let renderer = handlebars.compile(data)
        let html = renderer(variables)   
        options.html = html
        sendEmail(options)
    })
}


function sendUserPasswordEmail(user, password){
    configureEmail(TEMP_PASS_TEMPLATE, 'Temporary Password', user.email, {username: user.username, password})
}

function sendUserVerificationEmail(user, code){
    configureEmail(EMAIL_VERIFICATION_TEMPLATE, 'Verification Code', user.email, {username: user.username, code})
}

module.exports = {sendUserPasswordEmail, sendUserVerificationEmail}