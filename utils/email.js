/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1 Create a transporter(a service that will send the email)
  const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // for gmail, you need to activate the less secure app option
  });

  // 2 Define the email options
  const mailOptions = {
    from: 'Ejim Favour <favourejim56@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3 Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
