// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbconnect';
import User from '../../../models/users';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { name, email, password, otp } = await request.json();

    // Validate input
    if (!name || !email || !password || !otp) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Find user with the provided email and OTP
    const user = await User.findOne({ 
      email,
      otp,
      otpExpiry: { $gt: new Date() } // Check if OTP is not expired
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user with verified status and hashed password
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        name,
        password: hashedPassword,
        isVerified: true,
        $unset: { otp: 1, otpExpiry: 1 } // Remove OTP fields after successful verification
      },
      { new: true }
    );

    // Remove sensitive data before sending response
    const { password: _, ...userWithoutPassword } = updatedUser.toObject();

    return NextResponse.json({
      message: 'Registration successful',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}