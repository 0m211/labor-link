import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  amount: number;
  method: 'razorpay' | 'wallet' | 'cash';
  status: 'pending' | 'captured' | 'refunded' | 'failed';
  razorpay: {
    orderId: string;
    paymentId: string;
    signature: string;
  };
  refund: {
    refundId: string;
    amount: number;
    reason: string;
    refundedAt: Date;
  };
}

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: Schema.Types.ObjectId, ref: 'ServiceProvider' },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ['razorpay', 'wallet', 'cash'],
      default: 'razorpay'
    },
    status: {
      type: String,
      enum: ['pending', 'captured', 'refunded', 'failed'],
      default: 'pending'
    },
    razorpay: {
      orderId: { type: String, default: '' },
      paymentId: { type: String, default: '' },
      signature: { type: String, default: '' }
    },
    refund: {
      refundId: { type: String, default: '' },
      amount: { type: Number, default: 0 },
      reason: { type: String, default: '' },
      refundedAt: { type: Date }
    }
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>('Payment', PaymentSchema);