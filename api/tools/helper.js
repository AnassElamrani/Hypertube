require('dotenv').config()
const crypto = require("crypto-js")
const nodemailer = require('nodemailer')

exports.hashHmacSha256 = (string) => crypto.AES.encrypt(string, process.env.SECRET_KEY)
const wrapedSendMail = (mailOptions) => {
    return new Promise( (resolve,reject) =>{
        let mailConfig = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD 
            },
            tls: {
            rejectUnauthorized: false
            },
            secure: false
        })
        mailConfig.sendMail(mailOptions, function(error, info){
            if (error) {
                resolve(false);
            } 
            else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        })
    })
}

exports.sendEmail = async (to, subject, html) => { 
    let mailOptions = { 
        from: process.env.EMAIL,
        to,
        subject,
        html
    }
    let resp = await wrapedSendMail(mailOptions) 
    return resp
}
