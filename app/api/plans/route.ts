import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbconnect';
import Plan from '@/models/Plan';
import { NextApiRequest, NextApiResponse } from 'next';

// GET /api/plans
export async function GET() {
  try {
    await dbConnect();
    const plans = await Plan.find({}).sort({ createdAt: -1 });
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { message: 'Error fetching plans' },
      { status: 500 }
    );
  }
}

// POST /api/plans
export async function POST(request: Request) {
  try {
    const data = await request.json();
    await dbConnect();
    
    const plan = new Plan({
      ...data,
      features: data.features || [],
      isActive: data.isActive !== undefined ? data.isActive : true,
    });
    
    const savedPlan = await plan.save();
    return NextResponse.json(savedPlan, { status: 201 });
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json(
      { message: 'Error creating plan' },
      { status: 500 }
    );
  }
}
