
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbconnect';
import Doctor from '@/app/models/doctor';
import { hash } from 'bcryptjs';

// POST /api/doctors
export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received doctor payload:', data);

    // Simple required check
    if (!data.name || !data.email || !data.phone || !data.address) {
      return NextResponse.json(
        { message: "Name, email, phone & address are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check duplicates
    const existing = await Doctor.findOne({
      $or: [{ email: data.email }, { phone: data.phone }]
    });

    if (existing) {
      return NextResponse.json(
        { message: "Doctor already exists with this email or phone" },
        { status: 400 }
      );
    }

    // Hash default password
    const hashedPassword = await hash("Doctor@123", 12);

    // Create doctor
    const doctor = await Doctor.create({
      name: data.name,
      email: data.email,
      phone: data.phone,

      address: data.address,
      experience: Number(data.experience) || 0,
      category: data.category || "General Physician",
      specialization: data.specialization || data.category,

      price: Number(data.price) || 0,
      consultationFee: Number(data.consultationFee) || Number(data.price) || 0,

      image: data.image || "",

      clinicName: data.clinicName || "",
      degree: data.degree ,
      registrationAgency: data.registrationAgency || "",
      registrationNumber: data.registrationNumber || "",

      availableDates: data.availableDates || [],

      password: hashedPassword,
      isVerified: false,
      isActive: true
    });

    // Remove password from response
    const docRes = doctor.toObject();
    delete docRes.password;

    console.log("Doctor created:", docRes);

    return NextResponse.json(docRes, { status: 201 });

  } catch (err: any) {
    console.error("Doctor create error:", err);
    return NextResponse.json(
      {
        message: "Error creating doctor",
        error: err.message
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
    const email = searchParams.get("email");
    const id = searchParams.get("id"); 
    const category = searchParams.get("category");

    const query: any = {};

    if (email) query.email = email;
    else if (id) query._id = id;
    else if (category) {
      query.$or = [
        { category: { $regex: category, $options: "i" } },
        { specialization: { $regex: category, $options: "i" } }
      ];
    }

    const doctors = await Doctor.find(query).select("-password");

    return NextResponse.json(doctors);

  } catch (err) {
    console.error("Doctor fetch error:", err);
    return NextResponse.json(
      { message: "Error fetching doctors" },
      { status: 500 }
    );
  }
}
