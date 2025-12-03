// app/models/doctor.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IAvailableDate {
  date: string;
  timeSlots: string[];
}

export interface IDoctor extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  experience: number;
  category: string;
  specialization?: string;
  price: number;
  image: string;
  isVerified: boolean;
  isActive: boolean;
  password: string;
  availableDates: IAvailableDate[];
  createdAt: Date;
  updatedAt: Date;
}

const availableDateSchema = new Schema<IAvailableDate>({
  date: { type: String, required: true },
  timeSlots: [{ type: String }]
}, { _id: false });

const doctorSchema = new Schema<IDoctor>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  experience: { type: Number, required: true, default: 0 },
  category: { type: String, required: true, default: 'General Physician' },
  specialization: { type: String },
  price: { type: Number, required: true, default: 0 },
  image: { type: String, required: true, default: '' },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  availableDates: { type: [availableDateSchema], default: [] }
}, { timestamps: true });

export default mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', doctorSchema);