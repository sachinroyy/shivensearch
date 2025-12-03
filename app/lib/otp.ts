import nodemailer from 'nodemailer';

// In-memory store for OTPs (use a database in production)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOtp(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

  otpStore.set(email, { otp, expiresAt });

  try {
    await transporter.sendMail({
      from: `"Shiven Clinic" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Registration',
      text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976d2;">Shiven Clinic - OTP Verification</h2>
          <p>Your OTP for registration is:</p>
          <h1 style="font-size: 32px; letter-spacing: 8px; color: #1976d2; margin: 20px 0;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
}

export function verifyOtp(email: string, otp: string) {
  const otpData = otpStore.get(email);
  
  if (!otpData) {
    throw new Error('OTP not found or expired');
  }

  if (Date.now() > otpData.expiresAt) {
    otpStore.delete(email);
    throw new Error('OTP has expired');
  }

  if (otpData.otp !== otp) {
    throw new Error('Invalid OTP');
  }

  // OTP is valid, remove it from store
  otpStore.delete(email);
  return true;
}
