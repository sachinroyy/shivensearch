import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import dbConnect from '@/app/lib/dbconnect';
import CRMEntry from '@/app/models/CRMEntry';

interface Params {
  id: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    await dbConnect();
    
    // Validate ID format
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const entry = await CRMEntry.findById(params.id);
    
    if (!entry) {
      return NextResponse.json(
        { success: false, message: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: entry });
  } catch (error) {
    console.error('Error fetching CRM entry:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error fetching entry',
        ...(process.env.NODE_ENV === 'development' && { error: errorMessage })
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    await dbConnect();
    
    // Validate ID format
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const data = await request.json();
    
    // Update the entry
    const updatedEntry = await CRMEntry.findByIdAndUpdate(
      params.id,
      { ...data, date: new Date(data.date) },
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return NextResponse.json(
        { success: false, message: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedEntry });
 } catch (error: any) {
  console.error('Error updating CRM entry:', error);
  return NextResponse.json(
    { 
      success: false, 
      message: 'Error updating entry',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    },
    { status: 500 }
  );
}
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    await dbConnect();
    
    // Validate ID format
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const deletedEntry = await CRMEntry.findByIdAndDelete(params.id);
    
    if (!deletedEntry) {
      return NextResponse.json(
        { success: false, message: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Entry deleted successfully' 
    });
 } catch (error: any) {
  console.error('Error updating CRM entry:', error);
  return NextResponse.json(
    { 
      success: false, 
      message: 'Error updating entry',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    },
    { status: 500 }
  );
}
}
