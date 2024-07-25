const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp@gmail.com',
    port: 465,
    secure: true,
    auth:{
        user: process.env.EMAIL, //sender gmail address
        pass: process.env.EMAIL_APP_PASSWORD //sender app password for your gmail
    }
});

const sendEmailVerificationMail = async (userEmail, token) => {
    try{
        const verificationUrl = `https://alumcentralbackend-1.onrender.com/alumni/verify-email?token=${token}`;
        const mailOptions = {
            from:{
                name: 'AlumCentral',
                address: process.env.EMAIL
            },
            to: [userEmail, "btech10226.22@bitmesra.ac.in", "btech10260.22@bitmesra.ac.in"],
            subject: "Email Verification",
            text: `Please verify your email by clicking the following link: ${verificationUrl}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            return console.log(error);
            }
            console.log('Email sent to ' + userEmail);
        });
    }catch(err){
        console.log(err);
    }
    
}

const sendUserVerificationMail = async (userEmail) => {
    try{
        const mailOptions = {
            from:{
                name: 'AlumCentral',
                address: process.env.EMAIL
            },
            to: [userEmail],
            subject: "User Verification Complete",
            text: `Your User Verification is Complete !!\nYou can now Login to your AlumCentral account.\nLogin here: https://alum-central-frontend.vercel.app/AlumniLogin`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            return console.log(error);
            }
            console.log('Email sent to ' + userEmail);
        });
    }catch(err){
        console.log(err);
    }
    
}

module.exports = {sendEmailVerificationMail, sendUserVerificationMail};