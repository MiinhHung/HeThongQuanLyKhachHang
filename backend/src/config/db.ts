import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Khởi tạo Prisma Client
export const prisma = new PrismaClient();

// Kết nối MongoDB
export const connectMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.warn('CẢNH BÁO: MONGO_URI chưa được cấu hình trong file .env. Bỏ qua kết nối MongoDB.');
      return;
    }
    await mongoose.connect(mongoUri);
    console.log('>>> Đã kết nối thành công với MongoDB Atlas!');
  } catch (error) {
    console.error('LỖI: Không thể kết nối MongoDB Atlas:', error);
    process.exit(1);
  }
};
