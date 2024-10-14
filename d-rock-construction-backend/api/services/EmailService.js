const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    console.log('Initializing EmailService with the following configuration:');
    console.log('Host:', process.env.EMAIL_HOST);
    console.log('Port:', process.env.EMAIL_PORT);
    console.log('Secure:', process.env.EMAIL_SECURE);
    console.log('User:', process.env.EMAIL_USER);
    
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,   // smtp.gmail.com
      port: process.env.EMAIL_PORT,   // 587
      secure: process.env.EMAIL_SECURE === 'true',  // false for 587 (TLS)
      auth: {
        user: process.env.EMAIL_USER,  // Your Gmail address
        pass: process.env.EMAIL_PASS,  // App-specific password
      },
      debug: true,  // Enable debug output
    });

    console.log('SMTP configuration:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE,
    });
  }

  async sendEmail(to, subject, text) {
    try {
      console.log('Attempting to send email with the following details:');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Text:', text);

      const info = await this.transporter.sendMail({
        from: `"D-Rock Bot" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        text: text,
      });
      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      console.error('Error details:', error.message);
      if (error.response) {
        console.error('SMTP Response:', error.response);
      }
      throw error;
    }
  }
}

module.exports = new EmailService();
