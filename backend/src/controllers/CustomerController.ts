import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { CustomerNote } from '../models/CustomerNote';

export const createCustomer = async (req: Request, res: Response) => {
  const { name, company, industry, price, status, email, phone, location, source, appointment, description } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Các trường Họ và tên, Email, Số điện thoại là bắt buộc.' });
  }

  try {
    // Kiểm tra trùng lặp email hoặc số điện thoại
    const duplicate = await prisma.customer.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      }
    });

    if (duplicate) {
      return res.status(400).json({
        error: `Khách hàng đã tồn tại trong hệ thống với Email (${email}) hoặc Số điện thoại (${phone}) này.`
      });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        company,
        industry,
        price: price ? Number(price) : 0,
        status: status || 'NEW',
        email,
        phone,
        location,
        source,
        appointment: appointment ? new Date(appointment) : null,
        description
      }
    });

    return res.status(201).json(customer);
  } catch (err) {
    console.error('Lỗi tạo khách hàng:', err);
    return res.status(500).json({ error: 'Lỗi hệ thống khi tạo khách hàng.' });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json(customers);
  } catch (err) {
    console.error('Lỗi lấy danh sách khách hàng:', err);
    return res.status(500).json({ error: 'Lỗi hệ thống khi lấy danh sách.' });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        attachments: {
          include: {
            uploadedBy: {
              select: {
                id: true,
                fullName: true,
                username: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!customer) {
      return res.status(404).json({ error: 'Không tìm thấy khách hàng này.' });
    }

    // Đồng thời lấy lịch sử notes từ MongoDB Atlas
    const notes = await CustomerNote.find({ customerId: id }).sort({ createdAt: -1 });

    return res.json({
      ...customer,
      notes
    });
  } catch (err) {
    console.error('Lỗi lấy chi tiết khách hàng:', err);
    return res.status(500).json({ error: 'Lỗi hệ thống khi lấy chi tiết.' });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, company, industry, price, status, email, phone, location, source, appointment, description } = req.body;

  try {
    // Kiểm tra chống trùng email/sđt nếu thay đổi
    const duplicate = await prisma.customer.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              { email },
              { phone }
            ]
          }
        ]
      }
    });

    if (duplicate) {
      return res.status(400).json({
        error: `Không thể cập nhật. Email (${email}) hoặc Số điện thoại (${phone}) đã trùng với khách hàng khác.`
      });
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        name,
        company,
        industry,
        price: price !== undefined ? Number(price) : undefined,
        status,
        email,
        phone,
        location,
        source,
        appointment: appointment ? new Date(appointment) : null,
        description
      }
    });

    return res.json(updatedCustomer);
  } catch (err) {
    console.error('Lỗi cập nhật khách hàng:', err);
    return res.status(500).json({ error: 'Lỗi hệ thống khi cập nhật.' });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.customer.delete({
      where: { id }
    });
    // Đồng thời xóa notes tương ứng trên MongoDB
    await CustomerNote.deleteMany({ customerId: id });
    
    return res.json({ message: 'Xóa khách hàng và dữ liệu ghi chú liên quan thành công.' });
  } catch (err) {
    console.error('Lỗi xóa khách hàng:', err);
    return res.status(500).json({ error: 'Lỗi hệ thống khi xóa.' });
  }
};
