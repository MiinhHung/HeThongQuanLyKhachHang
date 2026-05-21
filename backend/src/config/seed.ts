import bcrypt from 'bcryptjs';
import { prisma } from './db';

export const seedDemoUsers = async () => {
  try {
    // Kiểm tra xem đã có user nào chưa
    const count = await prisma.user.count();
    if (count > 0) {
      console.log('>>> Cơ sở dữ liệu đã có tài khoản nhân viên. Bỏ qua tự động seed.');
      return;
    }

    console.log('>>> CSDL rỗng. Đang tự động seed 3 tài khoản nhân viên demo...');

    // Đặt mật khẩu mã hóa mặc định là "123"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123', salt);

    // Tạo Nguyễn Văn An
    await prisma.user.create({
      data: {
        username: 'an',
        email: 'an@crm.com',
        fullName: 'Nguyễn Văn An',
        password: hashedPassword,
        role: 'STAFF'
      }
    });

    // Tạo Trần Bình
    await prisma.user.create({
      data: {
        username: 'binh',
        email: 'binh@crm.com',
        fullName: 'Trần Bình',
        password: hashedPassword,
        role: 'STAFF'
      }
    });

    // Tạo Lê Chi
    await prisma.user.create({
      data: {
        username: 'chi',
        email: 'chi@crm.com',
        fullName: 'Lê Chi',
        password: hashedPassword,
        role: 'STAFF'
      }
    });

    console.log('>>> Seed tài khoản demo thành công!');
    console.log('    - Nguyễn Văn An (username: "an", password: "123")');
    console.log('    - Trần Bình    (username: "binh", password: "123")');
    console.log('    - Lê Chi       (username: "chi", password: "123")');
  } catch (error) {
    console.error('Lỗi khi tự động seed tài khoản demo:', error);
  }
};
