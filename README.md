# 🏢 CRM + HR Management System

> **Frontend-Only System** với Role-Based Access Control (RBAC), không cần backend

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5-red)](https://ant.design/)
[![Vite](https://img.shields.io/badge/Vite-5-purple)](https://vitejs.dev/)

## ✨ Tính năng chính

### 🔐 Authentication & Authorization
- ✅ Login/Logout với 5 roles khác nhau
- ✅ Role-Based Access Control (RBAC)
- ✅ 35+ granular permissions
- ✅ Session persistence (localStorage)
- ✅ Auto-redirect when unauthorized

### 👥 Multi-Role System
1. **Admin** - Quyền cao nhất, quản lý tất cả
2. **CRM Manager** - Quản lý CRM, chuyển khách hàng
3. **Sale** - Chỉ xem khách hàng của mình
4. **HR Manager** - Quản lý nhân sự, sửa lương
5. **HR Staff** - Xem nhân viên cùng phòng

### 📊 CRM Module
- ✅ Quản lý khách hàng
- ✅ Data filtering theo role (Admin thấy tất cả, Sale chỉ thấy của mình)
- ✅ Transfer khách hàng (permission-gated)
- ✅ Customer history tracking
- ✅ Priority & Status management

### 👨‍💼 HR Module
- ✅ Quản lý nhân viên
- ✅ Quản lý phòng ban
- ✅ Quản lý chức vụ
- ✅ Salary management (permission-based)
- ✅ Employee detail with history

### 🔒 Admin Module
- ✅ Dashboard tổng quan
- ✅ Audit Log (track toàn bộ hoạt động)
- ✅ Real-time statistics
- ✅ Role distribution charts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Server chạy tại: **http://localhost:3000**

### Build
```bash
npm run build
```

## 🔑 Demo Accounts

| Role | Username | Password | Permissions |
|------|----------|----------|-------------|
| **Admin** | admin | admin123 | Tất cả quyền |
| **CRM Manager** | crm_manager | crm123 | Quản lý CRM |
| **Sale** | sale1 | sale123 | Xem KH của mình |
| **HR Manager** | hr_manager | hr123 | Quản lý HR |
| **HR Staff** | hr_staff | hr123 | Xem NV cùng phòng |

## 📚 Documentation

### Quick Start
- 📖 [CRM_HR_SYSTEM.md](CRM_HR_SYSTEM.md) - Tài liệu hệ thống
- 🎯 [DEMO_GUIDE.md](DEMO_GUIDE.md) - Hướng dẫn demo chi tiết
- 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md) - Kiến trúc hệ thống

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **UI Library**: Ant Design 5
- **Routing**: React Router v6
- **Build Tool**: Vite 5
- **State Management**: React Context API
- **Styling**: TailwindCSS + Ant Design

## 🎯 Core Features

### Permission System
```tsx
// Route protection
<ProtectedRoute requiredPermissions={['crm:view_all_customers']}>
  <CustomerList />
</ProtectedRoute>

// Component protection
<PermissionGuard requiredPermissions={['crm:transfer_customer']}>
  <button>Chuyển khách hàng</button>
</PermissionGuard>
```

### Role-Based Data Filtering
- **Admin**: Thấy tất cả 5 customers
- **CRM Manager**: Thấy tất cả 5 customers  
- **Sale**: Chỉ thấy customers của mình
- **HR Manager**: Không thấy CRM module
- **HR Staff**: Chỉ thấy nhân viên cùng phòng

---

**Built with ❤️ using React + TypeScript + Ant Design**

🎯 [View Demo Guide](DEMO_GUIDE.md) | 🏗️ [View Architecture](ARCHITECTURE.md) | 📖 [View Full Docs](CRM_HR_SYSTEM.md)
