const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });

class Email {
  constructor(user) {
    this.to = user.email;
    this.name = user.name;
    this.url = `${process.env.APP_URL}email/confirmation?code=${user.confirmCode}`;
    this.from = `TicketDiv <${process.env.EMAIL_FROM}>`;
    this.userId = user._id;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async send(subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: `Please click the following link to confirm your email: ${this.url}`,
    };
    await this.newTransport().sendMail(mailOptions);
  }
  async sendVerify() {
    return await this.send('Verify email address for TicketDiv :>');
  }
}

module.exports = Email;
