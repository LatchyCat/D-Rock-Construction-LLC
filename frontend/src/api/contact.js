// pages/api/contact.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, requestType, message } = req.body;

    // Configure nodemailer with your email service details
    let transporter = nodemailer.createTransport({
      host: "your-smtp-host",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "your-email@example.com",
        pass: "your-email-password",
      },
    });

    try {
      // Send email
      await transporter.sendMail({
        from: '"Your Website" <your-email@example.com>',
        to: "client@example.com",
        subject: `New ${requestType} Request from ${name}`,
        text: `
          Name: ${name}
          Email: ${email}
          Phone: ${phone}
          Request Type: ${requestType}
          Message: ${message}
        `,
      });

      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
