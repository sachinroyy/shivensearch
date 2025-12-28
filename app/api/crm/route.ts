// app/api/crm/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbconnect';
import CRMEntry from '@/app/models/CRMEntry';
import { Types } from 'mongoose';

// Helper function to handle error responses
const handleError = (error: unknown, message: string): NextResponse => {
  console.error(`${message}:`, error);
  return NextResponse.json(
    { 
      success: false, 
      message,
      ...(process.env.NODE_ENV === 'development' && { 
        error: error instanceof Error ? error.message : String(error) 
      })
    },
    { status: 500 }
  );
};

// GET - Fetch all or single entry
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      if (!Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, message: 'Invalid ID format' },
          { status: 400 }
        );
      }

      const entry = await CRMEntry.findById(id);
      if (!entry) {
        return NextResponse.json(
          { success: false, message: 'Entry not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: entry });
    }

    // Get all entries
    const entries = await CRMEntry.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: entries });
  } catch (error) {
    return handleError(error, 'Error fetching entries');
  }
}

// POST - Create new entry
export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const newEntry = await CRMEntry.create({
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      date: data.date ? new Date(data.date) : new Date(),
      time: data.time || '',
      message: data.message,
      callType: data.callType || 'incoming',
      followUp: data.followUp || 'no',
      status: data.status || 'pending',
      callStatus: data.callStatus || '',
      needsFollowUp: data.needsFollowUp || false,
      followUpDate: data.followUpDate || '',
      followUpNotes: data.followUpNotes || ''
    });

    return NextResponse.json(
      { success: true, data: newEntry },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, 'Error creating entry');
  }
}

// PUT - Update existing entry
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const updateData: any = { ...data };
    
    // Convert date string to Date object if present
    if (data.date) {
      updateData.date = new Date(data.date);
    }

    const updatedEntry = await CRMEntry.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return NextResponse.json(
        { success: false, message: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedEntry 
    });
  } catch (error) {
    return handleError(error, 'Error updating entry');
  }
}