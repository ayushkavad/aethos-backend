const nodemailer = require('nodemailer');

/**
 * This function sends an email.
 *
 * @param {object} option The email options.
 * @returns {Promise<void>} A promise that resolves when the email is sent.
 */
 module.exports = async (option) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'John Devid <theak5410@gmail.com>',
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transporter.sendMail(mailOptions);
};
