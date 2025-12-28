import mongoose, { Document, Schema } from 'mongoose';

export interface ICRMEntry extends Document {
  name: string;
  phone: string;
  date: Date;
  time: string;
  message: string;
  callType: 'incoming' | 'outgoing';
  followUp: 'yes' | 'no';
  status: 'pending' | 'contacted' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const CRMEntrySchema = new Schema<ICRMEntry>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    message: { type: String, required: true },
    callType: { type: String, required: true, enum: ['incoming', 'outgoing'] },
    followUp: { type: String, required: true, enum: ['yes', 'no'], default: 'no' },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'completed'],
      default: 'pending',
      required: true
    },
  },
  { timestamps: true }
);

// Check if the model has already been compiled
const CRMEntry = mongoose.models.CRMEntry || mongoose.model<ICRMEntry>('CRMEntry', CRMEntrySchema);

export default CRMEntry;
