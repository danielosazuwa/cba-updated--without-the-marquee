'use strict';

const { Buffer } = require('buffer');
const path = require('path');
const nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');

const options = {
    viewEngine: {
        extName: '.hbs',
        partialsDir: '/views/emails/',
        layoutsDir: '',
        defaultLayout: '',
    },
    viewPath: path.join(__dirname, '../views/emails/')
};

let transporter = nodemailer.createTransport({
    //host: 'email-smtp.us-east-1.amazonaws.com',
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // true for 465, false for other ports,
    pool: true,
    rateLimit: 20,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PSWD
    }
});
transporter.use('compile', hbs(options));

const BASE_URL = process.env.BASE_URL;
const SENT_FROM = process.env.EMAIL;

const sendMail = (to, subject, template, data) => {
    let mailOptions = {
        from: '"Career Builders Academy" <' + SENT_FROM + '>',
        to: to,
        subject: subject,
        template: template,
        context: data
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}

module.exports = {
    sendConfirmationEmail: function (user) {
        const email_b64 = Buffer.from(user.email).toString('base64');
        const crypto = require('crypto');
        const hash = crypto.createHash('md5').update(user.email + 'okirikwenEE129Okpkenakai').digest('hex');

        const data = {
            user: user.fullname,
            url: BASE_URL + 'user/activate/' + email_b64 + '/' + hash,
            base_url: BASE_URL
        };
        const subject = "Confirm your email address";
        const template = 'verifyAccount';
        sendMail(user.email, subject, template, data);
    },

    emailCBA: function ({ sender_email, sender_name, sender_phone = '', subject = 'From FAQ', message }) {
        const template = 'emailCBA';
        const data = {
            sender_name,
            sender_email,
            sender_phone,
            message,
            base_url: BASE_URL
        };

        const mailOptions = {
            from: sender_name + '<' + SENT_FROM + '>',
            to: 'connect@decareerbuilders.com',
            replyTo: sender_email,
            subject: subject,
            template: template,
            context: data
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            // console.log('Message sent: %s', info.messageId);
        });
    }
}