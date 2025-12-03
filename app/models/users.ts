// // app/models/User.ts
// import mongoose, { Document, Schema } from 'mongoose';
// import bcrypt from 'bcryptjs';

// export interface IUser extends Document {
//   name: string;
//   email: string;
//   password: string;
//   phone?: string;
//   role: 'user' | 'admin' | 'doctor';
//   isVerified: boolean;
//   otp?: string;
//   otpExpiry?: Date;
//   comparePassword: (candidatePassword: string) => Promise<boolean>;
// }

// const userSchema = new Schema<IUser>({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true, lowercase: true },
//   password: { type: String, required: true, select: false },
//   phone: { type: String },
//   role: { type: String, enum: ['user', 'admin', 'doctor'], default: 'user' },
//   isVerified: { type: Boolean, default: false },
//   otp: { type: String, select: false },
//   otpExpiry: { type: Date, select: false }
// }, { timestamps: true });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// // Method to compare passwords
// userSchema.methods.comparePassword = async function(candidatePassword: string) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
// app/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'user' | 'admin' | 'doctor';
  isVerified: boolean;
  otp?: string;
  otpExpiry?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    phone: { type: String },
    role: { type: String, enum: ['user', 'admin', 'doctor'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, select: false },
    otpExpiry: { type: Date, select: false },
  },
  { timestamps: true }
);

// HASH PASSWORD (fixed version)
userSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
