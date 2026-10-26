import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  bookingId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  images: string[];
  isModerated: boolean;
  isHidden: boolean;
}

const ReviewSchema = new Schema<IReview>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
    images: [{ type: String }],
    isModerated: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<IReview>('Review', ReviewSchema);