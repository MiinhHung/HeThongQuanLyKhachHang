import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  senderId: string;      // ID user từ Postgres
  senderName: string;    // Tên hiển thị người gửi
  receiverId: string;    // ID user nhận từ Postgres
  content: string;       // Nội dung chat
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  receiverId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
