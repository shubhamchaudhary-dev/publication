import mongoose, { Document, Schema } from 'mongoose';

export interface ICMSValue {
  heroHeadline: string;
  heroSubheadline: string;
  featuredPaperIds: mongoose.Types.ObjectId[];
  stats: {
    papers: number;
    authors: number;
    institutions: number;
  };
}

export interface ICMSConfig extends Document {
  key: string;
  value: ICMSValue;
}

const CMSConfigSchema = new Schema<ICMSConfig>({
  key: { type: String, required: true, unique: true },
  value: {
    heroHeadline: { type: String, default: 'Advancing Knowledge Through Open Research' },
    heroSubheadline: { type: String, default: 'Discover, share, and explore peer-reviewed academic papers across all disciplines.' },
    featuredPaperIds: [{ type: Schema.Types.ObjectId, ref: 'Paper' }],
    stats: {
      papers: { type: Number, default: 0 },
      authors: { type: Number, default: 0 },
      institutions: { type: Number, default: 0 },
    },
  },
});

export default mongoose.model<ICMSConfig>('CMSConfig', CMSConfigSchema);
