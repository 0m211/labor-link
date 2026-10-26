import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  userType: 'customer' | 'provider' | 'admin';
  type: string;
  title: string;
  body: string;
  data: object;
  isRead: boolean;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    userType: {
      type: String,
      enum: ['customer', 'provider', 'admin'],
      required: true
    },
    type: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    data: { type: Object, default: {} },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);