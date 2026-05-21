import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';
import { connectMongoDB } from './config/db';
import { seedDemoUsers } from './config/seed';
import { initSocket } from './sockets/socketManager';

dotenv.config();

const app = express();
const server = createServer(app);

// Cấu hình Middleware
app.use(cors({
  origin: '*', // Hỗ trợ kết nối đa nguồn cho môi trường local & deploy cloud
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối cơ sở dữ liệu MongoDB Atlas và chạy seed
connectMongoDB().then(() => {
  seedDemoUsers();
});

// Tích hợp Socket.io
initSocket(server);

// Đăng ký API Routes
app.use('/api', apiRouter);

// Endpoint kiểm tra trạng thái hoạt động của Backend
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'CRM + Chat Internal API Server is running smoothly!'
  });
});

// Khởi chạy server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`  Backend đang chạy tại: http://localhost:${PORT}`);
  console.log(`=============================================`);
});
