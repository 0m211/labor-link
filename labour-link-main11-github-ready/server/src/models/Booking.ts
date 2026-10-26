import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  bookingNumber: string;
  customerId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  type: 'instant' | 'scheduled';
  status: 'pending' | 'searching' | 'assigned' | 'en_route' | 'arrived'
        | 'in_progress' | 'completed' | 'cancelled' | 'expired';
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    location: {
      type: string;
      coordinates: number[];
    };
  };
  scheduledAt: Date;
  acceptedAt: Date;
  arrivedAt: Date;
  startedAt: Date;
  completedAt: Date;
  cancelledAt: Date;
  cancelReason: string;
  cancelledBy: 'customer' | 'provider' | 'admin';
  problemDescription: string;
  images: string[];
  pricing: {
    baseAmount: number;
    discountAmount: number;
    couponCode: string;
    taxAmount: number;
    totalAmount: number;
    providerEarning: number;
    platformFee: number;
  };
  paymentId: mongoose.Types.ObjectId;
  providerLocation: {
    type: string;
    coordinates: number[];
  };
  otp: {
    start: string;
    end: string;
  };
  chatId: mongoose.Types.ObjectId;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingNumber: { type: String, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: Schema.Types.ObjectId, ref: 'ServiceProvider' },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    type: { type: String, enum: ['instant', 'scheduled'], required: true },
    status: {
      type: String,
      enum: ['pending', 'searching', 'assigned', 'en_route', 'arrived',
             'in_progress', 'completed', 'cancelled', 'expired'],
      default: 'pending'
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
      }
    },
    scheduledAt: { type: Date },
    acceptedAt: { type: Date },
    arrivedAt: { type: Date },
    startedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    cancelReason: { type: String, default: '' },
    cancelledBy: { type: String, enum: ['customer', 'provider', 'admin'] },
    problemDescription: { type: String, default: '' },
    images: [{ type: String }],
    pricing: {
      baseAmount: { type: Number, default: 0 },
      discountAmount: { type: Number, default: 0 },
      couponCode: { type: String, default: '' },
      taxAmount: { type: Number, default: 0 },
      totalAmount: { type: Number, default: 0 },
      providerEarning: { type: Number, default: 0 },
      platformFee: { type: Number, default: 0 }
    },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
    providerLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    },
    otp: {
      start: { type: String, default: '' },
      end: { type: String, default: '' }
    },
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat' }
  },
  { timestamps: true }
);

// Auto generate booking number
BookingSchema.pre('save', async function (next) {
  if (!this.bookingNumber) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingNumber = `LL-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Indexes
BookingSchema.index({ customerId: 1, createdAt: -1 });
BookingSchema.index({ providerId: 1, createdAt: -1 });
BookingSchema.index({ status: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);