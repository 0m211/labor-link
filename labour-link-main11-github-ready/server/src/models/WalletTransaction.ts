import mongoose, { Document, Schema } from 'mongoose';

export interface IWalletTransaction extends Document {
  providerId: mongoose.Types.ObjectId;
  type: 'credit' | 'debit' | 'withdrawal_request' | 'withdrawal_done';
  amount: number;
  description: string;
  bookingId: mongoose.Types.ObjectId;
  status: 'pending' | 'completed' | 'failed';
  utr: string;
}

const WalletTransactionSchema = new Schema<IWalletTransaction>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
    type: {
      type: String,
      enum: ['credit', 'debit', 'withdrawal_request', 'withdrawal_done'],
      required: true
    },
    amount: { type: Number, required: true },
    description: { type: String, default: '' },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed'
    },
    utr: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model<IWalletTransaction>('WalletTransaction', WalletTransactionSchema);