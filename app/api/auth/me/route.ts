import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/app/lib/dbconnect';
import User from '../../../models/users';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    // Get token from cookies
    const cookieHeader = request.headers.get('cookie') || '';
    const token = cookieHeader
      .split('; ')
      .find(row => row.startsWith('auth-token='))
      ?.split('=')[1];
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No authentication token found' },
        { status: 401 }
      );
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string };
      
      // Find user
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role
        }
      });
      
    } catch (error: any) {
      console.error('Token verification failed:', error);
      if (error.name === 'TokenExpiredError') {
        return NextResponse.json(
          { success: false, message: 'Session expired. Please log in again.' },
          { status: 401 }
        );
      }
      if (error.name === 'JsonWebTokenError') {
        return NextResponse.json(
          { success: false, message: 'Invalid token' },
          { status: 401 }
        );
      }
      throw error; // Re-throw to be caught by outer catch
    }

  } catch (error: any) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while fetching user data',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}