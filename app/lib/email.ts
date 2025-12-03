// app/lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  try {
    await transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};