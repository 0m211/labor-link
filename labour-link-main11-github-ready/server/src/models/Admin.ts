import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'superadmin' | 'admin' | 'moderator';
  isActive: boolean;
  comparePassword(password: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'moderator'],
      default: 'admin'
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

AdminSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model<IAdmin>('Admin', AdminSchema);