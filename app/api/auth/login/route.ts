import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbconnect';
import User from '../../../models/users';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role || 'user' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Create response with user data
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    // Create response with HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword
    });

    // Set HTTP-only cookie in the response
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'An error occurred during login. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}