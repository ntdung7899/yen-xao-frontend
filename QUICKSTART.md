# 🚀 Quick Start Guide - HR Admin System

## Bước 1: Cài đặt Dependencies

```bash
cd /Users/a410/Desktop/Project/yen-xao-frontend
npm install
```

**Packages sẽ được cài đặt:**
- react, react-dom, react-router-dom
- antd (UI components)
- @ant-design/icons
- react-hook-form, yup, @hookform/resolvers
- dayjs
- typescript, vite, eslint...

## Bước 2: Chạy Development Server

```bash
npm run dev
```

Server sẽ chạy tại: http://localhost:3000

## Bước 3: Khám phá ứng dụng

### 📌 Các trang có sẵn:

1. **Quản lý nhân viên** (`/hr/employees`)
   - Xem danh sách 16 nhân viên mẫu
   - Tìm kiếm theo tên, mã NV, email, SĐT
   - Lọc theo phòng ban, chức vụ, trạng thái, giới tính
   - Xem chi tiết nhân viên
   - Xóa nhân viên (với confirm)

2. **Quản lý phòng ban** (`/hr/departments`)
   - Xem 5 phòng ban dạng card
   - Thêm, sửa, xóa phòng ban
   - Hiển thị số lượng nhân viên

3. **Quản lý chức vụ** (`/hr/positions`)
   - Xem 8 chức vụ theo cấp bậc
   - Thêm, sửa, xóa chức vụ
   - Hiển thị số lượng nhân viên

## 📂 Cấu trúc files quan trọng

```
src/
├── App.tsx                         # Main app với routing
├── main.tsx                        # Entry point
├── components/layout/
│   └── MainLayout.tsx              # Layout chính
├── pages/hr/
│   ├── EmployeeList.tsx            # Trang danh sách nhân viên
│   ├── EmployeeDetail.tsx          # Trang chi tiết nhân viên
│   ├── DepartmentList.tsx          # Trang phòng ban
│   └── PositionList.tsx            # Trang chức vụ
├── data/mockData.ts                # Mock data (16 NV, 5 PB, 8 CV)
├── types/hr.types.ts               # TypeScript types
└── utils/
    ├── formatters.ts               # Format tiền, ngày, SĐT...
    └── validators.ts               # Validation schemas
```

## 🎯 Test các chức năng

### 1. Employee Management
- Click vào nhân viên để xem chi tiết
- Thử tìm kiếm: "Nguyễn", "NV001", "0901234567"
- Thử lọc theo IT department
- Click nút "Xóa" → confirm modal xuất hiện

### 2. Department Management
- Click "Thêm phòng ban"
- Nhập: Mã: "DEV", Tên: "Phát triển phần mềm"
- Click "Lưu" → Card mới xuất hiện
- Thử xóa phòng ban không có nhân viên

### 3. Position Management
- Click "Thêm chức vụ"
- Nhập: Mã: "TECH", Tên: "Kỹ thuật viên", Cấp: 6
- Click "Lưu" → Dòng mới xuất hiện trong table

## 🔧 Customize

### Thay đổi màu chủ đạo

File: `src/App.tsx`

```typescript
theme={{
  token: {
    colorPrimary: "#1890ff", // Đổi màu primary
    borderRadius: 8,          // Đổi border radius
  },
}}
```

### Thêm route mới

File: `src/App.tsx`

```typescript
<Route path="dashboard" element={<Dashboard />} />
```

### Thêm mock data

File: `src/data/mockData.ts`

```typescript
// Thêm nhân viên mới vào mockEmployees array
{
  id: "emp-17",
  employeeCode: "NV017",
  fullName: "Tên của bạn",
  // ... other fields
}
```

## 🐛 Troubleshooting

### Port 3000 bị chiếm

Edit `vite.config.ts`:

```typescript
server: {
  port: 3001, // Đổi port
}
```

### Build error

```bash
# Xóa node_modules và cài lại
rm -rf node_modules
npm install
```

### TypeScript errors

```bash
# Check với tsc
npx tsc --noEmit
```

## 📦 Build cho Production

```bash
# Build
npm run build

# Preview build
npm run preview
```

Files build sẽ ở folder `dist/`

## 🎨 Ant Design Components đã sử dụng

- Layout (Sider, Header, Content)
- Menu, Breadcrumb
- Table, Card, Avatar
- Button, Input, Select
- Modal, Form, Tabs
- Tag, Badge, Space
- Tooltip, Empty, Skeleton
- DatePicker, InputNumber

## 📚 Resources

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Ant Design Components](https://ant.design/components/overview/)
- [React Router](https://reactrouter.com/en/main)
- [React Hook Form](https://react-hook-form.com/)
- [Yup Validation](https://github.com/jquense/yup)

## 💡 Next Steps

1. ✅ Thêm form nhân viên (thêm/sửa)
2. ✅ Implement Dashboard với charts
3. ✅ Thêm authentication
4. ✅ Connect to real API
5. ✅ Add more filters & sorting
6. ✅ Export to Excel
7. ✅ Upload avatar functionality
8. ✅ Dark mode

---

**Chúc bạn code vui vẻ! 🎉**
