# HƯỚNG DẪN CẤU HÌNH CƠ SỞ DỮ LIỆU (SUPABASE & MONGODB ATLAS)

Dưới đây là hướng dẫn chi tiết từng bước bằng tiếng Việt giúp bạn tạo tài khoản và lấy các thông tin kết nối cho dự án CRM + Chat nội bộ. Cả 2 dịch vụ này đều hoàn toàn **MIỄN PHÍ** cho quy mô sử dụng nhỏ (dưới 10 người).

---

## PHẦN 1: THIẾT LẬP SUPABASE (PostgreSQL & Storage)

Supabase cung cấp cơ sở dữ liệu PostgreSQL và dịch vụ lưu trữ file đính kèm.

### Bước 1.1: Tạo tài khoản và Project mới
1. Truy cập vào trang web [https://supabase.com](https://supabase.com).
2. Chọn **Sign Up** và đăng ký bằng tài khoản **GitHub** (khuyên dùng) hoặc email cá nhân.
3. Tại giao diện Dashboard, nhấn nút **New Project** (Dự án mới).
4. Điền các thông tin:
   - **Name**: Nhập tên dự án (ví dụ: `crm-chat-internal`).
   - **Database Password**: Nhập mật khẩu CSDL của bạn (nhớ lưu lại mật khẩu này, chúng ta sẽ cần ở bước sau).
   - **Region**: Chọn khu vực gần Việt Nam nhất (ví dụ: `Singapore` hoặc `Southeast Asia`).
   - **Pricing Plan**: Chọn gói **Free** (Miễn phí).
5. Nhấn **Create new project** và chờ khoảng 1 - 2 phút để hệ thống khởi tạo.

### Bước 1.2: Lấy Connection String cho Prisma (DATABASE_URL)
1. Sau khi Project khởi tạo xong, truy cập vào menu **Project Settings** (biểu tượng bánh răng ở góc dưới bên trái) -> Chọn mục **Database**.
2. Cuộn xuống phần **Connection string**, chọn tab **URI**.
3. Copy đoạn chuỗi kết nối có dạng:
   ```text
   postgresql://postgres.[tên-dự-án]:[mật-khẩu-của-bạn]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```
4. **Lưu ý**: Hãy thay thế `[mật-khẩu-của-bạn]` bằng mật khẩu database bạn đã đặt ở Bước 1.1. Đây chính là biến `DATABASE_URL` trong file `.env` ở Backend.

### Bước 1.3: Tạo Storage Bucket để lưu file đính kèm
1. Ở menu bên trái, nhấp vào mục **Storage** (biểu tượng hình cái hộp/thùng chứa).
2. Nhấn nút **New Bucket** (Thùng chứa mới).
3. Đặt tên Bucket là `attachments` (viết thường, không dấu).
4. Chuyển trạng thái sang **Public** (Để mọi người có thể xem/tải trực tiếp qua link).
5. Nhấn **Save**.
6. Để cho phép upload file không cần đăng nhập phức tạp ở mức demo, ta cần cấu hình Policy:
   - Vào bucket `attachments`, chọn **Policies** ở menu bên trái.
   - Nhấn **New Policy** cho mục *Bucket Objects*.
   - Chọn **For full customization** (Tự cấu hình).
   - Chọn các hành động: `SELECT`, `INSERT`, `UPDATE`, `DELETE` (hoặc check All).
   - Phần Target Roles chọn `public` (để đơn giản hóa việc upload từ Backend).
   - Nhấn **Review** và **Save**.
7. Lấy API Key và Project URL:
   - Vào **Settings** -> **API**.
   - Copy **Project URL** (có dạng `https://[tên-dự-án].supabase.co`).
   - Copy **anon / public** key (API Key công khai) hoặc **service_role** key (Key có quyền admin, an toàn khi chạy ở Backend). Chúng ta sẽ dùng các key này trong code Backend để upload file.

---

## PHẦN 2: THIẾT LẬP MONGODB ATLAS (Chat & Note Timeline)

MongoDB Atlas sẽ dùng để lưu trữ lịch sử chat nội bộ và dòng timeline ghi chú khách hàng dạng NoSQL linh hoạt.

### Bước 2.1: Tạo tài khoản và Cluster miễn phí
1. Truy cập vào trang web [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Đăng ký tài khoản miễn phí bằng tài khoản Google hoặc Email của bạn.
3. Sau khi đăng nhập, chọn **Create a deployment**.
4. Chọn gói **M0** (FREE) -> Chọn Cloud Provider (AWS hoặc Google Cloud) và Region (chọn `Singapore` - `ap-southeast-1` để có tốc độ nhanh nhất).
5. Nhấn nút **Create**.

### Bước 2.2: Thiết lập bảo mật (Bắt buộc)
Khi Cluster đang khởi tạo, hệ thống sẽ yêu cầu bạn thiết lập bảo mật:
1. **Database Access (Tạo tài khoản CSDL)**:
   - Tạo một Username (ví dụ: `crmuser`).
   - Tạo một Password (ví dụ: bấm nút `Autogenerate Secure Password` hoặc đặt mật khẩu riêng của bạn). Nhớ copy/lưu lại thông tin này!
   - Nhấn **Create Database User**.
2. **Network Access (IP Access List)**:
   - Chọn **Allow Access from Anywhere** (Thêm IP `0.0.0.0/0`). Điều này vô cùng quan trọng vì khi bạn deploy Backend lên Render hay Railway, địa chỉ IP của server deploy sẽ thay đổi liên tục. Nếu không thêm `0.0.0.0/0`, database sẽ chặn không cho backend kết nối.
   - Nhấn **Add IP Address**.
3. Nhấn **Finish and Close** để quay lại Dashboard.

### Bước 2.3: Lấy Connection String (MONGO_URI)
1. Tại giao diện chính (Database), bạn sẽ thấy Cluster0 vừa tạo. Nhấn nút **Connect** (Kết nối).
2. Chọn phương thức kết nối là **Drivers** (Kết nối từ ứng dụng Node.js).
3. Copy chuỗi kết nối hiển thị trên màn hình. Nó sẽ có dạng như sau:
   ```text
   mongodb+srv://crmuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
4. **Lưu ý**: Hãy thay thế `<password>` bằng mật khẩu bạn đã tạo ở Bước 2.2 (xóa cả dấu `<` và `>`).
5. Ở cuối chuỗi, trước dấu `?`, bạn có thể chỉ định tên Database mặc định bằng cách thêm tên db mong muốn, ví dụ: `...mongodb.net/crm_database?retryWrites...`
6. Đây chính là biến `MONGO_URI` trong file `.env` ở Backend.

---

## TỔNG KẾT CÁC BIẾN MÔI TRƯỜNG CẦN THIẾT (.env)

Sau khi hoàn thành các bước trên, bạn sẽ có các thông tin sau để điền vào file cấu hình môi trường của Backend:

```env
PORT=5000
DATABASE_URL="postgresql://postgres.xxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
MONGO_URI="mongodb+srv://crmuser:password@cluster0.xxx.mongodb.net/crm_db?retryWrites=true&w=majority"
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_KEY="your-supabase-service-role-key"
JWT_SECRET="mot-chuoi-bi-mat-bat-ky-de-ma-hoa-token"
```
