import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'reader' | 'researcher' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  role: UserRole;
  avatarUrl?: string;
  institution?: string;
  isVerified: boolean;
  isRootAdmin: boolean;
  otp?: string;
  otpExpires?: Date;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    googleId: { type: String, sparse: true },
    role: { type: String, enum: ['reader', 'researcher', 'admin'], default: 'reader' },
    avatarUrl: { type: String },
    institution: { type: String, trim: true },
    isVerified: { type: Boolean, default: false },
    isRootAdmin: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IUser>('User', UserSchema);
