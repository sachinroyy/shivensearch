// app/api/upload/route.ts
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('photos') as File[];
    
    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate a unique filename
      const extension = file.name.split('.').pop();
      const filename = `${uuidv4()}.${extension}`;
      const path = join(process.cwd(), 'public', 'uploads', filename);
      
      await writeFile(path, buffer);
      
      return `/uploads/${filename}`;
    });

    const fileUrls = await Promise.all(uploadPromises);
    return NextResponse.json(fileUrls);
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { message: 'Error uploading files' },
      { status: 500 }
    );
  }
}