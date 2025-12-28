// app/models/ContactMessage.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['new', 'in_progress', 'resolved'],
    default: 'new'
  }
}, {
  timestamps: true
});

export default mongoose.models.ContactMessage || 
       mongoose.model<IContactMessage>('ContactMessage', contactMessageSchema);