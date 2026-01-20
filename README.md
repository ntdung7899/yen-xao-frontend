# 🎯 HR Management System - Admin Frontend

Hệ thống quản lý nhân sự (HR Management System) với giao diện admin hiện đại, responsive, được xây dựng bằng React + TypeScript + Ant Design.

## ✨ Tính năng

### 1. Dashboard
- ✅ Thống kê tổng quan (tổng nhân viên, đang làm, tuyển mới, nghỉ việc)
- ✅ Biểu đồ tròn (Pie Chart): Trạng thái nhân viên
- ✅ Biểu đồ cột (Bar Chart): Số lượng nhân viên theo phòng ban
- ✅ Biểu đồ đường (Line Chart): Xu hướng tuyển dụng và nghỉ việc
- ✅ Thống kê lương trung bình, tỷ lệ đang làm việc

### 2. Quản lý nhân viên
- ✅ Danh sách nhân viên với tìm kiếm, lọc, sắp xếp
- ✅ Xem chi tiết thông tin nhân viên
- ✅ Thêm, sửa, xóa nhân viên
- ✅ Lịch sử công việc
- ✅ Phân trang, xuất Excel

### 3. Quản lý phòng ban
- ✅ Hiển thị danh sách phòng ban dạng card
- ✅ Thêm, sửa, xóa phòng ban
- ✅ Hiển thị số lượng nhân viên và người quản lý
- ✅ Kiểm tra ràng buộc trước khi xóa

### 3. Quản lý chức vụ
- ✅ Danh sách chức vụ theo cấp bậc
- ✅ Thêm, sửa, xóa chức vụ
- ✅ Hiển thị số lượng nhân viên theo chức vụ

### 4. Tính năng chung
- ✅ Layout responsive (mobile, tablet, desktop)
- ✅ Sidebar navigation có thể collapse
- ✅ Breadcrumb navigation
- ✅ Form validation real-time
- ✅ Notifications/Toast messages
- ✅ Loading states
- ✅ Confirm modals
- ✅ Empty states

## 🛠️ Công nghệ sử dụng

- **React 18** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool (nhanh hơn CRA)
- **React Router v6** - Routing
- **Ant Design 5** - UI Components
- **React Hook Form** - Form management
- **Yup** - Validation
- **Day.js** - Date formatting
- **Recharts** - Charts and data visualization

## 📁 Cấu trúc thư mục

```
src/
├── components/
│   └── layout/
│       └── MainLayout.tsx          # Layout chính với sidebar & header
├── pages/
│   └── hr/
│       ├── Dashboard.tsx           # Dashboard với charts
│       ├── EmployeeList.tsx        # Danh sách nhân viên
│       ├── EmployeeDetail.tsx      # Chi tiết nhân viên
│       ├── DepartmentList.tsx      # Quản lý phòng ban
│       └── PositionList.tsx        # Quản lý chức vụ
├── types/
│   └── hr.types.ts                 # TypeScript types
├── data/
│   └── mockData.ts                 # Mock data & helpers
├── utils/
│   ├── formatters.ts               # Format functions
│   └── validators.ts               # Validation schemas
├── constants/
│   └── hr.constants.ts             # Constants
├── App.tsx                         # Main app component
└── main.tsx                        # Entry point
```

## 🚀 Cài đặt và chạy

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

### 3. Build production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## 📊 Mock Data

Hệ thống sử dụng mock data với:
- **16 nhân viên** mẫu
- **5 phòng ban**: IT, HR, Kinh doanh, Marketing, Kế toán
- **8 chức vụ**: từ CEO đến Intern
- **Lịch sử công việc** cho một số nhân viên

## 🎨 Giao diện

### Desktop
- Sidebar mở mặc định (200px)
- Table hiển thị đầy đủ columns
- Modal width: 800px

### Tablet (768px - 1023px)
- Sidebar có thể collapse
- Table scroll horizontal
- Modal width: 90%

### Mobile (< 768px)
- Sidebar thành drawer overlay
- Table chuyển card layout
- Modal full screen
- Form fields stack (1 column)

## 🔧 Validation Rules

### Nhân viên
- Email: Format chuẩn RFC 5322
- Số điện thoại: 10-11 số, bắt đầu bằng 0
- Tuổi: 18-65 tuổi
- Lương: Tối thiểu 5,000,000 VND

### Phòng ban
- Mã: Chỉ chữ in hoa và số, tối đa 10 ký tự
- Tên: 3-100 ký tự

### Chức vụ
- Mã: Chỉ chữ in hoa và số, tối đa 10 ký tự
- Cấp bậc: 1-7 (1 = cao nhất)

## 📱 Routes

```
/                          → Redirect to /hr/dashboard
/hr                        → Redirect to /hr/dashboard
/hr/dashboard              → Dashboard với charts và thống kê
/hr/employees              → Danh sách nhân viên
/hr/employees/:id          → Chi tiết nhân viên
/hr/departments            → Quản lý phòng ban
/hr/positions              → Quản lý chức vụ
```

## 🎯 Tính năng đã implement

- [x] Setup project với Vite + React + TypeScript
- [x] Cấu hình Ant Design với theme và locale tiếng Việt
- [x] Layout chính với sidebar và header
- [x] Dashboard với charts và statistics
- [x] Quản lý nhân viên (List, Detail, Delete)
- [x] Quản lý phòng ban (CRUD)
- [x] Quản lý chức vụ (CRUD)
- [x] Form validation với Yup
- [x] Search & Filter
- [x] Pagination
- [x] Sorting
- [x] Responsive design
- [x] Loading states
- [x] Notifications
- [x] Confirm modals

## 🔮 Tính năng có thể mở rộng

- [ ] Form thêm/sửa nhân viên (modal hoặc page riêng)
- [x] Dashboard với charts và statistics
- [ ] Dark mode
- [ ] Export to Excel với SheetJS
- [ ] Upload avatar
- [ ] Advanced filters
- [ ] Bulk actions
- [ ] Print employee profile
- [ ] Authentication & Authorization
- [ ] API integration (thay thế mock data)

## 🐛 Lưu ý

1. **Mock Data**: Hiện tại sử dụng mock data local. Để tích hợp API thật, thay thế các hàm trong `src/data/mockData.ts` bằng API calls.

2. **State Management**: Project sử dụng local state với `useState`. Nếu cần state phức tạp hơn, có thể thêm Context API hoặc Zustand.

3. **Form Employee**: Form thêm/sửa nhân viên chưa được implement đầy đủ (chỉ có delete). Có thể tạo component `EmployeeForm.tsx` tương tự như Department và Position.

## 💡 Tips

### Customize theme colors

Edit `src/App.tsx`:

```typescript
const theme = {
  token: {
    colorPrimary: "#1677ff", // Change primary color
    borderRadius: 6,
  },
};
```

### Add new routes

Edit `src/App.tsx`:

```typescript
<Route path="dashboard" element={<Dashboard />} />
```

### Change locale to English

```typescript
import enUS from "antd/locale/en_US";

<ConfigProvider locale={enUS}>
```

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 👨‍💻 Author

Built with ❤️ for HR Management System

---

**Happy coding! 🚀**
