// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbconnect';
import Contact from '@/models/contact';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, email, phone, message } = await request.json();
    
    // Input validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const contact = await Contact.create({
      name,
      email,
      phone: phone || '', // Make phone optional
      message,
      status: 'new' // Add default status
    });

    return NextResponse.json(
      { 
        success: true, 
        data: contact,
        message: 'Contact form submitted successfully' 
      }, 
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error saving contact:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation Error', messages: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to save contact',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}