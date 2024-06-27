/* eslint-disable node/no-extraneous-require */
/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

// console.log(htmlToText.toString());

const options = {
  wordwrap: 130,
  // ...
};

class Email {
  constructor(user, url, from) {
    this.to = user.email;
    this.firstName = user.name ? user.name.split(' ')[0] : '';
    this.url = url;
    this.from = `Brackifi <${from}>`;
    this.username = from;
  }

  // create a transport for the email
  newTransport() {
    return nodemailer.createTransport({
      // service: 'Gmail',
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: this.username,
        pass: process.env.EMAIL_PASSWORD,
      },
      // for gmail, you need to activate the less secure app option
    });
  }

  // send the actual email
  async send(template, subject) {
    // render html based on the pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      { firstName: this.firstName, url: this.url, subject },
    );

    // mail options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html, options),
    };

    // create transport and send
    await this.newTransport().sendMail(mailOptions);
  }

  // send a welcome message
  async sendSubscribed() {
    await this.send('subscribe', 'Welcome to Brackifi');
  }

  async sendWelcomeShareholder() {
    await this.send('welcomeShareholder', 'Welcome to Brackifi Shareholders');
  }

  async sendWelcomeInvestor() {
    await this.send('welcomeInvestor', 'Welcome to Brackifi Investors');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token, valid for 10mins',
    );
  }
}

// const sendEmail = async (options) => {
// 1 Create a transporter(a service that will send the email)
// const transporter = nodemailer.createTransport({
//   // service: 'Gmail',
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
//   // for gmail, you need to activate the less secure app option
// });

// 2 Define the email options
// const mailOptions = {
//   from: 'Ejim Favour <favourejim56@gmail.com>',
//   to: options.email,
//   subject: options.subject,
//   text: options.message,
//   // html:
// };

// // 3 Send the email
// await transporter.sendMail(mailOptions);
// };

module.exports = Email;

// const sendEmail = async (options) => {
//   // 1 Create a transporter(a service that will send the email)
//   const transporter = nodemailer.createTransport({
//     // service: 'Gmail',
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//     // for gmail, you need to activate the less secure app option
//   });

//   // 2 Define the email options
//   const mailOptions = {
//     from: 'Ejim Favour <favourejim56@gmail.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     // html:
//   };

//   // 3 Send the email
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
