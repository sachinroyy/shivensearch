import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbconnect';
import Appointment from '@/models/appointment';
import { NextRequest } from 'next/server';

// GET /api/appointments - Get all appointments with optional filtering
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const doctorId = searchParams.get('doctorId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (userId) query.userId = userId;
    if (doctorId) query.doctorId = doctorId;
    if (status) query.status = status;
    
    // Filter by doctor email if provided
    const doctorEmail = searchParams.get('doctorEmail');
    if (doctorEmail) {
      query.doctorEmail = doctorEmail;
    }

    // Get total count for pagination
    const total = await Appointment.countDocuments(query);
    
    // Get paginated appointments
    const appointments = await Appointment.find(query)
      .sort({ appointmentDate: -1 }) // Sort by most recent first
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch appointments',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Create a new appointment
export async function POST(request: Request) {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Successfully connected to database');

    // Parse the request body
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));

    const {
      name,
      email,
      phone,
      gender,
      appointmentType,
      date,
      time,
      doctorId,
      doctorName,
      doctorEmail,
      userId = 'guest', // Default to 'guest' if not provided
      notes = '',
    } = body;

    // Basic validation
    if (!name || !email || !phone || !gender || !appointmentType || !date || !time || !doctorId || !doctorName) {
      console.error('Missing required fields');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields',
          requiredFields: ['name', 'email', 'phone', 'gender', 'appointmentType', 'date', 'time', 'doctorId', 'doctorName']
        },
        { status: 400 }
      );
    }

    // Combine date and time into a single Date object
    let appointmentDate;
    try {
      console.log(`Creating date from: ${date}T${time}`);
      appointmentDate = new Date(`${date}T${time}`);
      if (isNaN(appointmentDate.getTime())) {
        throw new Error('Invalid date or time format');
      }
    } catch (error) {
      console.error('Error parsing date:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid date or time format',
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 400 }
      );
    }

    console.log('Creating appointment with data:', {
      doctorId,
      doctorName,
      doctorEmail,
      patientName: name,
      patientEmail: email,
      patientPhone: phone,
      appointmentDate,
      appointmentType,
      gender,
      notes,
      userId,
      status: 'pending',
    });

    // Create new appointment
    const appointment = await Appointment.create({
      doctorId,
      doctorName,
      doctorEmail,
      patientName: name,
      patientEmail: email,
      patientPhone: phone,
      appointmentDate,
      appointmentType,
      gender,
      notes,
      userId, // Include the userId in the appointment
      status: 'pending',
    });

    console.log('Appointment created successfully:', appointment);

    return NextResponse.json(
      { 
        success: true, 
        data: appointment,
        message: 'Appointment created successfully'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error in appointments API:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create appointment',
        error: error instanceof Error ? error.message : 'Unknown error',
        // Include more error details in development
        ...(process.env.NODE_ENV === 'development' && {
          errorDetails: error instanceof Error ? error.stack : undefined
        })
      },
      { status: 500 }
    );
  }
}