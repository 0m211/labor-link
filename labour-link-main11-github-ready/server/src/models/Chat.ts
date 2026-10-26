import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  _id: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  text: string;
  imageUrl: string;
  readBy: mongoose.Types.ObjectId[];
  createdAt: Date;
}

export interface IChat extends Document {
  bookingId: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  messages: IMessage[];
}

const MessageSchema = new Schema<IMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, required: true },
    text: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    readBy: [{ type: Schema.Types.ObjectId }],
    createdAt: { type: Date, default: Date.now }
  }
);

const ChatSchema = new Schema<IChat>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', unique: true },
    participants: [{ type: Schema.Types.ObjectId }],
    messages: [MessageSchema]
  },
  { timestamps: true }
);

export default mongoose.model<IChat>('Chat', ChatSchema);