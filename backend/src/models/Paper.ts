import mongoose, { Document, Schema } from 'mongoose';

export type PaperStatus = 'submitted' | 'under_review' | 'rejected' | 'published';

export interface IPaper extends Document {
  title: string;
  abstract: string;
  pdfUrl: string;         // original user-submitted file (Word/PDF)
  publishedPdfUrl?: string; // admin-uploaded final formatted PDF
  authors: string[];
  subject: mongoose.Types.ObjectId;
  status: PaperStatus;
  createdBy: mongoose.Types.ObjectId;
  slug: string;
  views: number;
  downloads: number;
  createdAt: Date;
  publishedAt?: Date;
  remarks?: string;
}

const PaperSchema = new Schema<IPaper>(
  {
    title: { type: String, required: true, trim: true },
    abstract: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    publishedPdfUrl: { type: String },
    authors: [{ type: String, trim: true }],
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    status: { type: String, enum: ['submitted', 'under_review', 'rejected', 'published'], default: 'submitted' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    publishedAt: { type: Date },
    remarks: { type: String, maxlength: 2000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

PaperSchema.index({ title: 'text', abstract: 'text' });
PaperSchema.index({ subject: 1, status: 1 });
PaperSchema.index({ createdBy: 1 });

export default mongoose.model<IPaper>('Paper', PaperSchema);
