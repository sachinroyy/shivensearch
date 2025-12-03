// app/api/doctors/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbconnect';
import Doctor from '../../models/doctor';
import { hash } from 'bcryptjs';

// POST /api/doctors
export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received doctor data:', data);
    
    // Basic validation
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { message: 'Name, email, and phone are required fields' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ 
      $or: [
        { email: data.email },
        { phone: data.phone }
      ] 
    });

    if (existingDoctor) {
      return NextResponse.json(
        { message: 'Doctor with this email or phone already exists' },
        { status: 400 }
      );
    }

    // Set default password
    const hashedPassword = await hash('Doctor@123', 12);

    // Create doctor with both old and new field names for backward compatibility
    const doctorData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address || '',
      experience: Number(data.experience) || 0,
      category: data.category || 'General Physician',
      specialization: data.specialization || 'General Physician',
      price: Number(data.price) || Number(data.consultationFee) || 0,
      image: data.image || '',
      password: hashedPassword,
      isVerified: false,
      isActive: true,
      availableDates: data.availableDates || [],
      // For backward compatibility
      consultationFee: Number(data.price) || Number(data.consultationFee) || 0,
    };

    const doctor = new Doctor(doctorData);
    const savedDoctor = await doctor.save();
    
    // Return only necessary fields in response
    const { password, ...responseData } = savedDoctor.toObject();
    
    console.log('Doctor created successfully:', responseData);
    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('Error in doctor creation:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { 
        message: 'Error creating doctor',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
// GET /api/doctors
export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const email = searchParams.get('email');
    const id = searchParams.get('id');
    
    let query: any = {};
    
    if (email) {
      // Search by exact email match
      query.email = email;
    } else if (id) {
      // Search by ID
      query._id = id;
    } else if (category) {
      // Case-insensitive search for category in both category and specialization fields
      query.$or = [
        { category: { $regex: category, $options: 'i' } },
        { specialization: { $regex: category, $options: 'i' } }
      ];
    }
    
    const doctors = await Doctor.find(query, { password: 0 }); // Exclude password field
    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { message: 'Error fetching doctors' },
      { status: 500 }
    );
  }
}