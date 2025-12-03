// app/api/auth/send-otp/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbconnect';
import User from '../../../models/users';
import { sendEmail } from '@/app/lib/email';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to user or temp storage
    // For new users, we'll update if exists or create new
    await User.findOneAndUpdate(
      { email },
      { 
        otp,
        otpExpiry,
        email,
        // Set a temporary flag to indicate this is a pre-registration OTP
        isVerified: false
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send OTP via email
    try {
      await sendEmail({
        to: email,
        subject: 'Your OTP for Registration',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Verify Your Email</h2>
            <p>Your OTP for registration is: <strong>${otp}</strong></p>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { message: 'Error sending OTP email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'OTP sent successfully' 
    });

  } catch (error) {
    console.error('Error in send-otp:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}