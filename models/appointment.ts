// app/models/appointment.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  doctorId: string;
  doctorName: string;
  doctorEmail: string;
  userId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: Date;
  appointmentType: 'online' | 'offline';
  gender: 'male' | 'female' | 'other';
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

const appointmentSchema = new Schema<IAppointment>({
  doctorId: { type: String, required: true },
  doctorName: { type: String, required: true },
  doctorEmail: { type: String, required: true },
  userId: { type: String, required: true },
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  patientPhone: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  appointmentType: { 
    type: String, 
    enum: ['online', 'offline'], 
    default: 'online' 
  },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'other'], 
    required: true 
  },
  notes: String,
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
    default: 'pending' 
  }
}, { timestamps: true });

export default mongoose.models.Appointment || 
       mongoose.model<IAppointment>('Appointment', appointmentSchema);