import multer from 'multer';

// Sử dụng memoryStorage để lưu trữ file tạm thời trong RAM trước khi đẩy lên Supabase Storage
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Giới hạn kích thước file tải lên: 10MB
  }
});
