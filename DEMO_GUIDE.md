# 🎯 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG CRM + HR

## 🚀 Khởi động nhanh

### Bước 1: Chạy ứng dụng
```bash
npm run dev
```

Server: http://localhost:3000

### Bước 2: Đăng nhập
Truy cập http://localhost:3000/login

## 🔐 TÀI KHOẢN DEMO

### 1️⃣ Admin (Quyền cao nhất)
- **Username**: `admin`
- **Password**: `admin123`
- **Quyền hạn**: Xem tất cả, quản lý tất cả
- **Menu**: Admin (Overview, Audit Log), CRM, HR

**Demo scenario**:
1. Login với tài khoản admin
2. Vào Admin > Overview → Thấy dashboard tổng quan
3. Vào Admin > Audit Log → Thấy toàn bộ log hệ thống
4. Vào CRM > Khách hàng → Thấy tất cả 5 khách hàng
5. Vào HR > Nhân viên → Thấy tất cả 7 nhân viên

---

### 2️⃣ CRM Manager
- **Username**: `crm_manager`
- **Password**: `crm123`
- **Quyền hạn**: Quản lý CRM, không thấy HR
- **Menu**: CRM only

**Demo scenario**:
1. Login với tài khoản crm_manager
2. Redirect tự động về /admin/overview (không có quyền) → Redirect về Access Denied
3. Click vào CRM > Khách hàng → Thấy tất cả 5 khách hàng
4. Click button "Chuyển" trên bất kỳ khách hàng nào → Thành công (có quyền transfer)
5. Thử truy cập /hr/employees → Access Denied (không có quyền)
6. Menu không hiển thị HR

---

### 3️⃣ Sale (Staff level)
- **Username**: `sale1`
- **Password**: `sale123`
- **Quyền hạn**: Chỉ xem khách hàng của mình
- **Menu**: CRM only

**Demo scenario**:
1. Login với tài khoản sale1
2. Vào CRM > Khách hàng → **CHỈ THẤY 2 khách hàng** (CUST002, CUST003)
   - Lọc theo `assignedTo === 'user-3'`
   - Không thấy khách hàng của người khác
3. Click vào chi tiết khách hàng → Thấy đầy đủ thông tin
4. **KHÔNG CÓ** button "Chuyển khách hàng" (không có permission)
5. Thử truy cập /admin → Access Denied
6. Menu không hiển thị HR, Admin

---

### 4️⃣ HR Manager
- **Username**: `hr_manager`
- **Password**: `hr123`
- **Quyền hạn**: Quản lý HR, không thấy CRM
- **Menu**: HR only

**Demo scenario**:
1. Login với tài khoản hr_manager
2. Vào HR > Nhân viên → Thấy tất cả 7 nhân viên
3. Có thể xem lương của tất cả nhân viên
4. Có button Tạo/Sửa/Xóa nhân viên
5. Thử truy cập /crm/customers → Access Denied
6. Menu không hiển thị CRM, Admin

---

### 5️⃣ HR Staff
- **Username**: `hr_staff`
- **Password**: `hr123`
- **Quyền hạn**: Xem nhân viên cùng phòng, không sửa lương
- **Menu**: HR only

**Demo scenario**:
1. Login với tài khoản hr_staff
2. Vào HR > Nhân viên → Thấy nhân viên trong phòng HR (dept-2)
3. Xem lương nhưng **KHÔNG SỬA ĐƯỢC**
4. Có button Tạo/Sửa nhân viên (không có Delete)
5. Menu không hiển thị CRM, Admin

---

## 📊 KIỂM TRA PHÂN QUYỀN

### ✅ Test Case 1: Data Filtering
**Mục tiêu**: Kiểm tra việc lọc data theo role

1. Login `admin` → CRM Customers → Thấy: **5 khách hàng**
2. Login `crm_manager` → CRM Customers → Thấy: **5 khách hàng**
3. Login `sale1` → CRM Customers → Thấy: **2 khách hàng** (chỉ của user-3)
4. Login `sale2` → CRM Customers → Thấy: **1 khách hàng** (chỉ của user-6)

**Kết quả mong đợi**: Mỗi role thấy data khác nhau

---

### ✅ Test Case 2: UI Hide/Show
**Mục tiêu**: Kiểm tra button tự động ẩn/hiện

1. Login `admin` → CRM Customer Detail
   - ✅ Có button "Chuyển"
   - ✅ Có button "Chỉnh sửa"
   - ✅ Có section "Lịch sử hoạt động"

2. Login `sale1` → CRM Customer Detail
   - ❌ KHÔNG có button "Chuyển"
   - ✅ Có button "Chỉnh sửa"
   - ✅ Có section "Lịch sử hoạt động"

3. Login `hr_manager` → Truy cập /crm/customers
   - ❌ Access Denied

**Kết quả mong đợi**: UI tự động ẩn theo permission

---

### ✅ Test Case 3: Route Protection
**Mục tiêu**: Kiểm tra route guard

1. Login `sale1` → Manually truy cập `/admin/overview`
   - ❌ Access Denied

2. Login `sale1` → Manually truy cập `/hr/employees`
   - ❌ Access Denied

3. Login `hr_manager` → Manually truy cập `/crm/customers`
   - ❌ Access Denied

4. Login `admin` → Truy cập bất kỳ route nào
   - ✅ Thành công

**Kết quả mong đợi**: Route được bảo vệ đúng permission

---

### ✅ Test Case 4: Audit Log
**Mục tiêu**: Kiểm tra ghi log hoạt động

1. Login `admin`
2. Vào Admin > Audit Log
3. Thấy log: "Đăng nhập hệ thống" - Action: login
4. Logout
5. Login lại `admin`
6. Vào Admin > Audit Log
7. Thấy 2 log mới: logout + login

**Kết quả mong đợi**: Mọi hoạt động đều được ghi log

---

### ✅ Test Case 5: Menu Dynamic
**Mục tiêu**: Kiểm tra menu tự động thay đổi theo role

1. Login `admin`
   - Menu: Admin, CRM, HR (3 sections)

2. Login `crm_manager`
   - Menu: CRM only (1 section)

3. Login `hr_manager`
   - Menu: HR only (1 section)

4. Login `sale1`
   - Menu: CRM only (1 section)

**Kết quả mong đợi**: Menu chỉ hiển thị module có quyền

---

## 🎨 TÍNH NĂNG NỔI BẬT

### 1. Permission-based UI Rendering
```tsx
// Button tự động ẩn nếu không có quyền
<PermissionGuard requiredPermissions={['crm:transfer_customer']}>
  <button>Chuyển khách hàng</button>
</PermissionGuard>
```

### 2. Data Filtering theo Role
```tsx
// Sale chỉ thấy khách hàng của mình
const visibleCustomers = hasPermission('crm:view_all_customers')
  ? allCustomers
  : allCustomers.filter(c => c.assignedTo === user.id);
```

### 3. Route Protection
```tsx
<ProtectedRoute requiredPermissions={['admin:view_all_data']}>
  <AdminOverview />
</ProtectedRoute>
```

### 4. Audit Log tự động
- Mỗi action (login, create, update, transfer...) tự động ghi log
- Admin xem được toàn bộ
- Filter theo action, entity, user, success/failed

---

## 🔍 ĐIỂM QUAN TRỌNG

### ⚠️ Phân quyền theo ROLE
- ✅ Admin: Tất cả permissions
- ✅ CRM Manager: CRM permissions (view all, transfer)
- ✅ Sale: CRM permissions (view own only)
- ✅ HR Manager: HR permissions (view all, edit salary)
- ✅ HR Staff: HR permissions (view department, no edit salary)

### ⚠️ Data Isolation
- Sale **KHÔNG BAO GIỜ** thấy được:
  - Khách hàng của người khác
  - HR data
  - Admin data
  - Audit log

- HR Staff **KHÔNG BAO GIỜ** thấy được:
  - CRM data
  - Nhân viên ngoài phòng mình
  - Admin data

### ⚠️ UI Auto Hide
- Button "Chuyển KH" chỉ hiện với Admin & CRM Manager
- Lương chỉ hiện với HR Manager (có quyền edit)
- HR Staff thấy lương nhưng KHÔNG EDIT được
- Menu tự động ẩn module không có quyền

---

## 📦 MOCK DATA

### Users: 7
- 1 Admin
- 1 CRM Manager
- 3 Sales (2 team)
- 1 HR Manager
- 1 HR Staff

### Customers: 5
- 2 assigned to user-3 (sale1)
- 2 assigned to user-2 (crm_manager)
- 1 assigned to user-6 (sale2)

### Departments: 3
- Sales, HR, IT

### Positions: 5
- CEO, CRM Manager, Sale, HR Manager, HR Staff

---

## 🎯 KẾT LUẬN

Hệ thống đã implement đầy đủ:
- ✅ Authentication & Authorization
- ✅ Role-Based Access Control (RBAC)
- ✅ Permission-based UI rendering
- ✅ Data filtering theo role & scope
- ✅ Route protection
- ✅ Audit logging
- ✅ Dynamic menu
- ✅ Mock data với state management

**Không có Backend, tất cả chạy frontend-only!**

---

**Chúc test vui vẻ! 🎉**
