//Using Gmail
/*const express = require('express');
const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET);
OAuth2_client.setCredentials({refresh_token: process.env.GMAIL_TOKEN});
let router = express.Router();


const accessToken = OAuth2_client.getAccessToken();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        type: 'OAuth2',
        user: "amonomni@gmail.com",
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_TOKEN,
        accessToken: accessToken,
    }
})



router
    .route('/')
    .post( async (req,res) =>{
        if(!(req.body.phoneNumber === undefined)){
            res.send({success: false});
            console.log("Potential spambot prevented");
            return;
        }
        
        const mailerOptions = {
            from: process.env.MAIL_USER,
            to: process.env.MAIL_TO,
            subject: req.body.name,
            text: req.body.message
        }
        console.log("trying to send");

        try{
            transporter.sendMail(mailerOptions, (err, info) =>{
                if(err){
                    console.log(err);
                    return;
                }

                console.log("sent" + info.response);
                res.send({success: true});
            });
        }catch(e){
            res.sendStatus(500);
        }
    });


module.exports = router;
*/


//Using Cpanel Webmail
const express = require('express');
const nodemailer = require('nodemailer');

let router = express.Router();

const transporter = nodemailer.createTransport({
    host: "robertha.ca",
    secure: true,
    secureConnection: false, // TLS requires secureConnection to be false
    tls: {
        maxVersion: 'TLSv1.2'
    },
    requireTLS:true,
    port: 465,
    debug: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
})



router
    .route('/')
    .post( async (req,res) =>{
        if(!(req.body.phoneNumber === undefined)){
            res.send({success: false});
            console.log("Potential spambot prevented");
            return;
        }
        
        const mailerOptions = {
            from: process.env.MAIL_USER,
            to: process.env.MAIL_TO,
            subject: req.body.name,
            text: req.body.message
        }

        try{
            await transporter.sendMail(mailerOptions, (err, info) =>{
                if(err){
                    console.log(err);
                    return;
                }

                console.log("sent" + info.response);
                res.send({success: true});
            });
        }catch(e){
            res.sendStatus(500);
        }
    });


module.exports = router;