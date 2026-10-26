import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IServiceProvider extends Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  avatar: string;
  services: mongoose.Types.ObjectId[]; // ✅ renamed for clarity
  experience: number;
  bio: string;
  kyc: {
    aadharNumber: string;
    panNumber: string;
    aadharFront: string;
    aadharBack: string;
    panImage: string;
    selfie: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason: string;
    verifiedAt: Date;
  };
  location: {
    type: string;
    coordinates: number[];
  };
  isOnline: boolean;
  isActive: boolean;
  isVerified: boolean;
  rating: {
    average: number;
    count: number;
  };
  wallet: {
    balance: number;
    totalEarned: number;
    pendingWithdrawal: number;
  };
  bankDetails: {
    accountNumber: string;
    ifsc: string;
    accountHolder: string;
    upiId: string;
  };
  otp: {
    code: string;
    expiresAt: Date;
  };
  deviceTokens: string[];
  refreshTokens: string[];
  comparePassword(password: string): Promise<boolean>;
}

const ServiceProviderSchema = new Schema<IServiceProvider>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: '' },

    // ✅ renamed from serviceCategories → services
    services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],

    experience: { type: Number, default: 0 },
    bio: { type: String, default: '' },
    kyc: {
      aadharNumber: { type: String, default: '' },
      panNumber: { type: String, default: '' },
      aadharFront: { type: String, default: '' },
      aadharBack: { type: String, default: '' },
      panImage: { type: String, default: '' },
      selfie: { type: String, default: '' },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      rejectionReason: { type: String, default: '' },
      verifiedAt: { type: Date }
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    },
    isOnline: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    },
    wallet: {
      balance: { type: Number, default: 0 },
      totalEarned: { type: Number, default: 0 },
      pendingWithdrawal: { type: Number, default: 0 }
    },
    bankDetails: {
      accountNumber: { type: String, default: '' },
      ifsc: { type: String, default: '' },
      accountHolder: { type: String, default: '' },
      upiId: { type: String, default: '' }
    },
    otp: {
      code: { type: String, default: '' },
      expiresAt: { type: Date }
    },
    deviceTokens: [{ type: String }],
    refreshTokens: [{ type: String }]
  },
  { timestamps: true }
);

// ✅ Indexes for fast queries
ServiceProviderSchema.index({ location: '2dsphere' });
ServiceProviderSchema.index({ isOnline: 1, isVerified: 1 });
ServiceProviderSchema.index({ services: 1 });

ServiceProviderSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model<IServiceProvider>('ServiceProvider', ServiceProviderSchema);
