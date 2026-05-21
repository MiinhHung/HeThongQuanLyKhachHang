import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';

export const register = async (req: Request, res: Response) => {
  const { username, email, password, fullName, role } = req.body;

  if (!username || !email || !password || !fullName) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ các trường thông tin bắt buộc.' });
  }

  try {
    // Kiểm tra trùng lặp
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username hoặc Email đã được sử dụng.' });
    }

    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Lưu vào database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        fullName,
        role: role || 'STAFF'
      }
    });

    return res.status(201).json({
      message: 'Đăng ký tài khoản thành công.',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('Lỗi đăng ký:', err);
    return res.status(500).json({ error: 'Lỗi hệ thống khi đăng ký.' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ Username và Mật khẩu.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(400).json({ error: 'Tài khoản hoặc mật khẩu không chính xác.' });
    }

    // So khớp mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Tài khoản hoặc mật khẩu không chính xác.' });
    }

    // Tạo JWT Token
    const tokenSecret = process.env.JWT_SECRET || 'secret-fallback';
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      tokenSecret,
      { expiresIn: '7d' } // Token có hiệu lực 7 ngày
    );

    return res.json({
      message: 'Đăng nhập thành công.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    return res.status(500).json({ error: 'Lỗi hệ thống khi đăng nhập.' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true
      }
    });
    return res.json(users);
  } catch (err) {
    console.error('Lỗi lấy danh sách user:', err);
    return res.status(500).json({ error: 'Lỗi hệ thống khi lấy danh sách user.' });
  }
};
