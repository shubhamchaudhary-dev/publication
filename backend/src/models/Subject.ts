import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  slug: string;
  createdAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<ISubject>('Subject', SubjectSchema);
