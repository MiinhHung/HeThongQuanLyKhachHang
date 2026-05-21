import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('CẢNH BÁO: Cấu hình SUPABASE_URL hoặc SUPABASE_KEY bị thiếu trong .env. Tính năng upload file sẽ không khả dụng.');
}

// Khởi tạo Supabase Client
export const supabase = createClient(supabaseUrl, supabaseKey);
