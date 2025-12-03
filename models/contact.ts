import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
}

const contactSchema = new Schema<IContact>({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  phone: { 
    type: String,
    required: [true, 'Phone number is required']
  },
  message: { 
    type: String, 
    required: [true, 'Message is required'],
    minlength: [10, 'Message should be at least 10 characters long']
  },
  status: { 
    type: String, 
    enum: ['new', 'in_progress', 'resolved'], 
    default: 'new' 
  }
}, { timestamps: true });

export default mongoose.models.Contact || 
       mongoose.model<IContact>('Contact', contactSchema);
