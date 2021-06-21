const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOST,
    // port: process.env.SMTP_PORT,
    // auth: {
    //   user: process.env.SMTP_EMAIL,
    //   pass: process.env.SMTP_PASSWORD,
    // },
    service: 'gmail',
    auth: {
      user: 'testuser07101998@gmail.com',
      pass: 'koelapps@1234',
    },
  });

  let message = {
    from: `Koel Apps`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
