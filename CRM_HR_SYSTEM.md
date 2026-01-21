# 🏢 CRM + HR System - Frontend Only

Hệ thống quản lý CRM và HR với phân quyền role-based, không backend, sử dụng mock data.

## ✨ Tính năng chính

### 🔐 Authentication & Authorization
- ✅ Login/Logout với mock credentials
- ✅ Role-based access control (RBAC)
- ✅ Permission-based UI rendering
- ✅ Protected routes
- ✅ Auto-redirect khi không có quyền

### 👥 Roles & Permissions

#### 1. **Admin** (Quyền cao nhất)
- ✅ Xem tất cả dữ liệu CRM, HR
- ✅ Xem Audit Log
- ✅ Quản lý users, roles
- ✅ Export data
- Username: `admin` / Password: `admin123`

#### 2. **CRM Manager**
- ✅ Xem tất cả khách hàng
- ✅ Tạo, sửa khách hàng
- ✅ Chuyển khách hàng
- ✅ Xem lịch sử khách hàng
- ❌ Không xem được HR data
- Username: `crm_manager` / Password: `crm123`

#### 3. **Sale**
- ✅ Xem khách hàng của mình
- ✅ Tạo, sửa khách hàng của mình
- ✅ Xem lịch sử khách hàng
- ❌ Không chuyển khách hàng
- ❌ Không xem được HR data
- Username: `sale1` / Password: `sale123`

#### 4. **HR Manager**
- ✅ Xem tất cả nhân viên
- ✅ Tạo, sửa, xóa nhân viên
- ✅ Xem và sửa lương
- ❌ Không xem được CRM data
- Username: `hr_manager` / Password: `hr123`

#### 5. **HR Staff**
- ✅ Xem nhân viên trong phòng ban của mình
- ✅ Tạo, sửa nhân viên
- ✅ Xem lương (không sửa)
- ❌ Không xem được CRM data
- Username: `hr_staff` / Password: `hr123`

### 📊 CRM Module
- ✅ Danh sách khách hàng (filter theo role)
- ✅ Chi tiết khách hàng
- ✅ Chuyển khách hàng (CRM Manager only)
- ✅ Lịch sử khách hàng (lock theo permission)
- ✅ Search & Filter
- ✅ Priority & Status management

### 👨‍💼 HR Module
- ✅ Danh sách nhân viên
- ✅ Chi tiết nhân viên
- ✅ Quản lý phòng ban
- ✅ Quản lý chức vụ
- ✅ Lương (hiển thị theo permission)
- ❌ Sale/CRM không thấy HR module

### 🔒 Admin Module
- ✅ Dashboard tổng quan
- ✅ Audit Log (theo dõi toàn bộ hoạt động)
- ✅ Thống kê real-time
- ✅ Role distribution
- ❌ Chỉ Admin mới truy cập được

## 🚀 Quick Start

### 1. Install Dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 2. Run Development Server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Server sẽ chạy tại: http://localhost:3000

### 3. Login
Truy cập http://localhost:3000/login và chọn một trong các tài khoản demo:
- **Admin**: admin / admin123
- **CRM Manager**: crm_manager / crm123
- **Sale**: sale1 / sale123
- **HR Manager**: hr_manager / hr123
- **HR Staff**: hr_staff / hr123

## 📁 Project Structure

\`\`\`
src/
├── components/
│   ├── guards/
│   │   ├── ProtectedRoute.tsx      # Route guard
│   │   └── PermissionGuard.tsx     # Component-level guard
│   └── layout/
│       └── MainLayout.tsx          # Main layout với dynamic menu
├── contexts/
│   └── AuthContext.tsx             # Auth state & logic
├── data/
│   ├── mockData.ts                 # HR mock data
│   └── mockAuthData.ts             # Auth, CRM, Audit mock data
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx           # Login page
│   │   └── AccessDeniedPage.tsx    # 403 page
│   ├── admin/
│   │   ├── AdminOverview.tsx       # Admin dashboard
│   │   └── AuditLogPage.tsx        # Audit log viewer
│   ├── crm/
│   │   ├── CustomerList.tsx        # Customer list với filter
│   │   └── CustomerDetail.tsx      # Customer detail với history
│   └── hr/
│       ├── Dashboard.tsx
│       ├── EmployeeList.tsx
│       ├── EmployeeDetail.tsx
│       ├── DepartmentList.tsx
│       └── PositionList.tsx
├── types/
│   ├── auth.types.ts               # Auth & Permission types
│   ├── crm.types.ts                # CRM types
│   ├── hr.types.ts                 # HR types
│   └── audit.types.ts              # Audit Log types
└── App.tsx                         # Main app với routing

\`\`\`

## 🔑 Phân quyền chi tiết

### Permission List

#### CRM Permissions
- \`crm:view_all_customers\` - Xem tất cả khách hàng
- \`crm:view_own_customers\` - Xem khách hàng của mình
- \`crm:create_customer\` - Tạo khách hàng
- \`crm:edit_customer\` - Sửa khách hàng
- \`crm:delete_customer\` - Xóa khách hàng
- \`crm:transfer_customer\` - Chuyển khách hàng
- \`crm:view_customer_history\` - Xem lịch sử khách hàng

#### HR Permissions
- \`hr:view_all_employees\` - Xem tất cả nhân viên
- \`hr:view_department_employees\` - Xem nhân viên cùng phòng
- \`hr:create_employee\` - Tạo nhân viên
- \`hr:edit_employee\` - Sửa thông tin nhân viên
- \`hr:delete_employee\` - Xóa nhân viên
- \`hr:view_salary\` - Xem lương
- \`hr:edit_salary\` - Sửa lương

#### Admin Permissions
- \`admin:view_audit_log\` - Xem audit log
- \`admin:manage_users\` - Quản lý users
- \`admin:manage_roles\` - Quản lý roles
- \`admin:view_all_data\` - Xem tất cả dữ liệu

### Usage Examples

#### 1. Route Protection
\`\`\`tsx
<ProtectedRoute requiredPermissions={["crm:view_all_customers"]}>
  <CustomerList />
</ProtectedRoute>
\`\`\`

#### 2. Component Protection
\`\`\`tsx
<PermissionGuard requiredPermissions={["crm:transfer_customer"]}>
  <button>Chuyển khách hàng</button>
</PermissionGuard>
\`\`\`

#### 3. Hide vs Disable
\`\`\`tsx
<PermissionGuard 
  requiredPermissions={["hr:edit_salary"]}
  hideIfNoAccess={false}
  fallback={<button disabled>Chỉnh sửa (Không có quyền)</button>}
>
  <button>Chỉnh sửa lương</button>
</PermissionGuard>
\`\`\`

## 🎯 Features Demo

### Data Filtering theo Role
- **Admin**: Thấy tất cả 5 customers
- **CRM Manager**: Thấy tất cả 5 customers
- **Sale (user-3)**: Chỉ thấy 2 customers được assign cho mình
- **HR Manager**: Không thấy CRM module
- **HR Staff**: Không thấy CRM module

### UI Auto Hide/Disable
- Button "Chuyển khách hàng" chỉ hiện với Admin & CRM Manager
- Button "Tạo khách hàng" chỉ hiện với user có quyền create
- Lịch sử khách hàng bị lock nếu không có permission
- Menu navigation tự động ẩn module không có quyền

### Audit Log
- Tự động ghi log khi:
  - Login/Logout
  - Tạo/Sửa/Xóa dữ liệu
  - Chuyển khách hàng
  - Truy cập bị từ chối
- Chỉ Admin xem được

## 🔄 Mock Data Flow

1. **Login**: Check credentials → Find user → Save to localStorage → Set auth context
2. **Permission Check**: Auth context → User permissions → Component/Route render
3. **Data Filter**: User role → Filter data → Display allowed records
4. **Audit Log**: Every action → Create log entry → Add to mockAuditLogs array
5. **Logout**: Clear localStorage → Clear auth context → Redirect to login

## 🛠️ Tech Stack

- ⚛️ React 18 + TypeScript
- 🎨 Ant Design
- 🚦 React Router v6
- 🎯 Role-Based Access Control (RBAC)
- 💾 LocalStorage for session
- 📦 Mock Data (No Backend)

## 📝 Notes

- ❗ Tất cả data là mock, lưu trong memory, refresh sẽ mất
- ❗ Session được lưu trong localStorage, F5 không mất session
- ❗ Audit log được append vào array, không persist
- ❗ Password được check trực tiếp, không mã hóa (demo only)

## 🎓 Learning Points

1. **RBAC Implementation**: Cách implement role-based access control
2. **Permission Guards**: Protect routes và components
3. **Conditional Rendering**: Render UI based on permissions
4. **Mock Data Management**: Quản lý state với mock data
5. **TypeScript Types**: Strongly typed permissions & roles

## 🚧 Future Enhancements (Nếu cần)

- [ ] Backend integration
- [ ] Real database
- [ ] JWT authentication
- [ ] Password encryption
- [ ] Persistent audit log
- [ ] Real-time notifications
- [ ] Export to Excel/PDF
- [ ] Advanced filtering
- [ ] Dashboard charts

---

**Built with ❤️ by Senior Frontend Engineer**
