import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbconnect';
import ContactMessage from '@/app/models/ContactMessage';
import { Types } from 'mongoose';

// GET all contact messages
export async function GET() {
  try {
    await dbConnect();
    
    const messages = await ContactMessage.find().sort({ createdAt: -1 }); // Sort by newest first
    
    return NextResponse.json({ 
      success: true, 
      data: messages 
    });
 } catch (error) {
    console.error('Error creating contact message:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
        { 
            success: false, 
            message: 'Error creating contact message',
            ...(process.env.NODE_ENV === 'development' && { error: errorMessage })
        },
        { status: 500 }
    );
}
}

// POST a new contact message
export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required' },
        { status: 400 }
      );
    }
    
    const message = await ContactMessage.create({
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      message: body.message,
      status: 'new'
    });
    
    return NextResponse.json({ 
      success: true, 
      data: message 
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
        { 
            success: false, 
            message: 'Error creating contact message',
            ...(process.env.NODE_ENV === 'development' && { error: errorMessage })
        },
        { status: 500 }
    );
}
}

// PATCH to update a contact message status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    // Validate ID format
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid message ID format' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate status
    const validStatuses = ['new', 'in_progress', 'resolved'];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid status. Must be one of: new, in_progress, resolved' 
        },
        { status: 400 }
      );
    }
    
    const updatedMessage = await ContactMessage.findByIdAndUpdate(
      id,
      { 
        status: body.status,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedMessage) {
      return NextResponse.json(
        { success: false, message: 'Message not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: updatedMessage 
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
        { 
            success: false, 
            message: 'Error creating contact message',
            ...(process.env.NODE_ENV === 'development' && { error: errorMessage })
        },
        { status: 500 }
    );
}
}