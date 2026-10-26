import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
  basePrice: number;
  category: string;
  isActive: boolean;
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    basePrice: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model<IService>('Service', ServiceSchema);