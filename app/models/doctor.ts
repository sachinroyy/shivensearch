
import mongoose, { Document, Schema } from 'mongoose';

export interface IAvailableDate {
  date: Date;
  timeSlots: string[];
  isBooked?: boolean;
}

export interface IDoctor extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  experience: number;
  category: string;
  specialization: string;
  price: number;
  consultationFee: number;
  image: string;
  isVerified: boolean;
  isActive: boolean;
  password: string;
  availableDates: IAvailableDate[];
  clinicName?: string;
  degree: string;
  registrationAgency?: string;
  registrationNumber?: string;
}

const availableDateSchema = new Schema<IAvailableDate>({
  date: { type: Date, required: true },
  timeSlots: { type: [String], required: true },
  isBooked: { type: Boolean, default: false }
});

const doctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    address: { type: String, required: true },
    experience: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },

    specialization: { type: String, required: true },

    price: { type: Number, default: 0 },
    consultationFee: { type: Number, default: 0 },

    image: { type: String, default: '' },

    password: { type: String, required: true },

    clinicName: { type: String },
    degree: { type: String },
    registrationAgency: { type: String },
    registrationNumber: { type: String },

    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    availableDates: { type: [availableDateSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', doctorSchema);
