import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: 'customer';
  avatar: string;
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
  isVerified: boolean;
  isActive: boolean;
  otp: {
    code: string;
    expiresAt: Date;
  };
  referralCode: string;
  referredBy: mongoose.Types.ObjectId;
  preferredLanguage: string;
  deviceTokens: string[];
  refreshTokens: string[];
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'customer' },
    avatar: { type: String, default: '' },
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
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    otp: {
      code: { type: String, default: '' },
      expiresAt: { type: Date }
    },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    preferredLanguage: { type: String, default: 'en' },
    deviceTokens: [{ type: String }],
    refreshTokens: [{ type: String }]
  },
  { timestamps: true }
);

// Indexes
UserSchema.index({ 'address.location': '2dsphere' });

// Compare password method
UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);