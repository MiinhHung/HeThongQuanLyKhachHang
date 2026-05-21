import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomerNote extends Document {
  customerId: string;    // ID khách hàng từ Postgres
  authorId: string;      // ID user viết Note từ Postgres
  authorName: string;    // Tên hiển thị người viết Note
  content: string;       // Nội dung ghi chú (chứa tag @Tên_Thành_Viên)
  createdAt: Date;
}

const CustomerNoteSchema = new Schema<ICustomerNote>({
  customerId: { type: String, required: true, index: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const CustomerNote = mongoose.model<ICustomerNote>('CustomerNote', CustomerNoteSchema);
