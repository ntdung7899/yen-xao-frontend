# 🔐 PHÂN QUYỀN HỆ THỐNG - ROLE PERMISSIONS

> Tài liệu mô tả chi tiết các chức năng và quyền hạn của từng vai trò trong hệ thống CRM + HR

---

## 📊 TỔNG QUAN CÁC VAI TRÒ

Hệ thống có **5 vai trò (roles)** chính:

```
Hệ thống
├── Admin (Quản trị viên)
├── CRM Manager (Quản lý CRM)
├── Sale (Nhân viên bán hàng)
├── HR Manager (Quản lý nhân sự)
└── HR Staff (Nhân viên nhân sự)
```

---

## 👨‍💼 1. ADMIN (Quản trị viên)

**Mô tả**: Có toàn quyền quản lý hệ thống, bao gồm cả CRM, HR và Admin

### 🎯 Chức năng CRM
```
CRM
├── 📋 Xem tất cả khách hàng (crm:view_all_customers)
│   └── Quyền: Xem toàn bộ danh sách khách hàng trong hệ thống
├── ➕ Tạo khách hàng mới (crm:create_customer)
│   └── Quyền: Thêm khách hàng mới vào hệ thống
├── ✏️ Chỉnh sửa khách hàng (crm:edit_customer)
│   └── Quyền: Cập nhật thông tin khách hàng
├── 🗑️ Xóa khách hàng (crm:delete_customer)
│   └── Quyền: Xóa khách hàng khỏi hệ thống
├── 🔄 Chuyển khách hàng (crm:transfer_customer)
│   └── Quyền: Chuyển khách hàng cho nhân viên sale khác
└── 📜 Xem lịch sử khách hàng (crm:view_customer_history)
    └── Quyền: Xem toàn bộ lịch sử tương tác với khách hàng
```

### 🎯 Chức năng HR
```
HR
├── 👥 Xem tất cả nhân viên (hr:view_all_employees)
│   └── Quyền: Xem toàn bộ danh sách nhân viên trong công ty
├── ➕ Tạo nhân viên mới (hr:create_employee)
│   └── Quyền: Thêm nhân viên mới vào hệ thống
├── ✏️ Chỉnh sửa nhân viên (hr:edit_employee)
│   └── Quyền: Cập nhật thông tin nhân viên
├── 🗑️ Xóa nhân viên (hr:delete_employee)
│   └── Quyền: Xóa nhân viên khỏi hệ thống
├── 💰 Xem lương (hr:view_salary)
│   └── Quyền: Xem thông tin lương của nhân viên
└── 💵 Chỉnh sửa lương (hr:edit_salary)
    └── Quyền: Cập nhật thông tin lương nhân viên
```

### 🎯 Chức năng Chấm công
```
Chấm công
├── ⏰ Chấm công vào (attendance:checkin)
│   └── Quyền: Ghi nhận giờ vào làm
├── 🏁 Chấm công ra (attendance:checkout)
│   └── Quyền: Ghi nhận giờ ra về
├── 👁️ Xem chấm công của mình (attendance:view_own)
│   └── Quyền: Xem lịch sử chấm công cá nhân
├── 👥 Xem chấm công team (attendance:view_team)
│   └── Quyền: Xem chấm công của cả team
├── 🏢 Xem chấm công phòng ban (attendance:view_department)
│   └── Quyền: Xem chấm công toàn phòng ban
├── 📊 Xem tất cả chấm công (attendance:view_all)
│   └── Quyền: Xem chấm công toàn công ty
├── ✅ Duyệt chấm công (attendance:approve)
│   └── Quyền: Phê duyệt bảng chấm công
└── ✏️ Sửa chấm công (attendance:edit)
    └── Quyền: Chỉnh sửa bản ghi chấm công
```

### 🎯 Chức năng Admin
```
Admin
├── 📝 Xem nhật ký hệ thống (admin:view_audit_log)
│   └── Quyền: Xem lịch sử các thao tác trong hệ thống
├── 👤 Quản lý người dùng (admin:manage_users)
│   └── Quyền: Thêm/sửa/xóa/khóa người dùng
├── 🔐 Quản lý vai trò (admin:manage_roles)
│   └── Quyền: Phân quyền và quản lý vai trò
└── 🗄️ Xem tất cả dữ liệu (admin:view_all_data)
    └── Quyền: Truy cập toàn bộ dữ liệu hệ thống
```

**Tổng số quyền**: 24 permissions (6 CRM + 6 HR + 8 Chấm công + 4 Admin)

---

## 👩‍💼 2. CRM MANAGER (Quản lý CRM)

**Mô tả**: Quản lý toàn bộ hoạt động CRM, giám sát đội ngũ sale

### 🎯 Chức năng CRM
```
CRM
├── 📋 Xem tất cả khách hàng (crm:view_all_customers)
│   └── Quyền: Xem toàn bộ khách hàng của tất cả sale trong team
├── ➕ Tạo khách hàng mới (crm:create_customer)
│   └── Quyền: Thêm khách hàng mới vào hệ thống
├── ✏️ Chỉnh sửa khách hàng (crm:edit_customer)
│   └── Quyền: Cập nhật thông tin bất kỳ khách hàng nào
├── 🔄 Chuyển khách hàng (crm:transfer_customer)
│   └── Quyền: Phân bổ lại khách hàng giữa các sale
└── 📜 Xem lịch sử khách hàng (crm:view_customer_history)
    └── Quyền: Theo dõi lịch sử tương tác của khách hàng
```

### 🎯 Chức năng Chấm công
```
Chấm công
├── ⏰ Chấm công vào (attendance:checkin)
│   └── Quyền: Ghi nhận giờ vào làm
├── 🏁 Chấm công ra (attendance:checkout)
│   └── Quyền: Ghi nhận giờ ra về
├── 👁️ Xem chấm công của mình (attendance:view_own)
│   └── Quyền: Xem lịch sử chấm công cá nhân
├── 👥 Xem chấm công team (attendance:view_team)
│   └── Quyền: Xem chấm công của team (cho Manager)
├── 🏢 Xem chấm công phòng ban (attendance:view_department)
│   └── Quyền: Xem chấm công phòng ban (cho Manager)
└── ✅ Duyệt chấm công (attendance:approve)
    └── Quyền: Phê duyệt/xác nhận bảng chấm công
```

**Tổng số quyền**: 11 permissions (5 CRM + 6 Chấm công)

**Lưu ý**: 
- ❌ Không có quyền xóa khách hàng (cần Admin)
- ❌ Không có quyền truy cập module HR
- ❌ Không có quyền truy cập chức năng Admin

---

## 🧑‍💼 3. SALE (Nhân viên bán hàng)

### 🎯 Chức năng Chấm công
```
Chấm công
├── ⏰ Chấm công vào (attendance:checkin)
│   └── Quyền: Ghi nhận giờ vào làm của bản thân
├── 🏁 Chấm công ra (attendance:checkout)
│   └── Quyền: Ghi nhận giờ ra về của bản thân
└── 👁️ Xem chấm công của mình (attendance:view_own)
    └── Quyền: Xem lịch sử chấm công cá nhân
```

**Tổng số quyền**: 7 permissions (4 CRM + 3 Chấm công)ợc phân công, tương tác với khách hàng

### 🎯 Chức năng CRM
```
CRM
├── 👁️ Xem khách hàng của mình (crm:view_own_customers)
│   └── Quyền: Chỉ xem khách hàng được phân công cho mình
│   └── Phạm vi: Khách hàng có assignedTo = user.id
├── ➕ Tạo khách hàng mới (crm:create_customer)
│   └── Quyền: Thêm khách hàng mới (tự động assign cho mình)
├── ✏️ Chỉnh sửa khách hàng (crm:edit_customer)
│   └── Quyền: Cập nhật thông tin khách hàng của mình
│   └── Phạm vi: Chỉ khách hàng được phân công
└── 📜 Xem lịch sử khách hàng (crm:view_customer_history)
    └── Quyền: Xem lịch sử tương tác với khách hàng của mình
```

**Tổng số quyền**: 4 permissions

**Lưu ý**:
- ❌ Không thể xem khách hàng của sale khác
- ❌ Không có quyền xóa khách hàng
- ❌ Không có quyền chuyển khách hàng
- ❌ Không có quyền truy cập module HR
- ❌ Không có quyền truy cập chức năng Admin

---
### 🎯 Chức năng Chấm công
```
Chấm công
├── ⏰ Chấm công vào (attendance:checkin)
│   └── Quyền: Ghi nhận giờ vào làm
├── 🏁 Chấm công ra (attendance:checkout)
│   └── Quyền: Ghi nhận giờ ra về
├── 👁️ Xem chấm công của mình (attendance:view_own)
│   └── Quyền: Xem lịch sử chấm công cá nhân
├── 📊 Xem tất cả chấm công (attendance:view_all)
│   └── Quyền: Xem chấm công toàn công ty
├── ✅ Duyệt chấm công (attendance:approve)
│   └── Quyền: Phê duyệt bảng chấm công nhân viên
└── ✏️ Sửa chấm công (attendance:edit)
    └── Quyền: Chỉnh sửa/điều chỉnh bản ghi chấm công
```

**Tổng số quyền**: 12 permissions (6 HR + 6 Chấm công)
## 👩‍💼 4. HR MANAGER (Quản lý nhân sự)

**Mô tả**: Quản lý toàn bộ hoạt động nhân sự, quản lý phòng ban và lương

### 🎯 Chức năng HR
```
HR
├── 👥 Xem tất cả nhân viên (hr:view_all_employees)
│   └── Quyền: Xem toàn bộ danh sách nhân viên trong công ty
│   └── Phạm vi: Tất cả phòng ban, tất cả nhân viên
├── ➕ Tạo nhân viên mới (hr:create_employee)
│   └── Quyền: Tuyển dụng và thêm nhân viên mới
│   └── Chức năng: Nhập thông tin cá nhân, phòng ban, chức vụ
├── ✏️ Chỉnh sửa nhân viên (hr:edit_employee)
│   └── Quyền: Cập nhật thông tin nhân viên
│   └── Chức năng: Sửa thông tin cá nhân, chuyển phòng ban, đổi chức vụ
├── 🗑️ Xóa nhân viên (hr:delete_employee)
│   └── Quyền: Xóa nhân viên khỏi hệ thống
│   └── Sử dụng: Khi nhân viên nghỉ việc hoặc dữ liệu sai
├── 💰 Xem lương (hr:view_salary)
│   └── Quyền: Xem thông tin lương của tất cả nhân viên
│   └── Phạm vi: Lương cơ bản, phụ cấp, thưởng
└── 💵 Chỉnh sửa lương (hr:edit_salary)
    └── Quyền: Điều chỉnh lương nhân viên
    └── Chức năng: Tăng lương, thưởng, phụ cấp
```

**Tổng số quyền**: 6 permissions

### 🎯 Chức năng Chấm công
```
Chấm công
├── ⏰ Chấm công vào (attendance:checkin)
│   └── Quyền: Ghi nhận giờ vào làm của bản thân
├── 🏁 Chấm công ra (attendance:checkout)
│   └── Quyền: Ghi nhận giờ ra về của bản thân
├── 👁️ Xem chấm công của mình (attendance:view_own)
│   └── Quyền: Xem lịch sử chấm công cá nhân
└── 🏢 Xem chấm công phòng ban (attendance:view_department)
    └── Quyền: Xem chấm công nhân viên cùng phòng ban
```

**Tổng số quyền**: 8 permissions (4 HR + 4 Chấm công)
- ✅ Có toàn quyền trong module HR
- ❌ Không có quyền truy cập module CRM
- ❌ Không có quyền truy cập chức năng Admin

---

## 🧑‍💼 5. HR STAFF (Nhân viên nhân sự)

**Mô tả**: Hỗ trợ công việc nhân sự, xử lý hồ sơ nhân viên trong phạm vi phòng ban

### 🎯 Chức năng HR
```
HR
├── 👁️ Xem nhân viên phòng ban (hr:view_department_employees)
│   └── Quyền: Chỉ xem nhân viên cùng phòng ban
│   └── Phạm vi: Nhân viên có departmentId = user.departmentId
├── ➕ Tạo nhân viên mới (hr:create_employee)
│   └── Quyền: Thêm nhân viên mới (thường cho phòng ban của mình)
│   Chấm công Module** |
| Chấm công vào/ra | ✅ | ✅ | ✅ | ✅ | ✅ |
| Xem chấm công của mình | ✅ | ✅ | ✅ | ✅ | ✅ |
| Xem chấm công team | ✅ | ✅ | ❌ | ❌ | ❌ |
| Xem chấm công phòng ban | ✅ | ✅ | ❌ | ❌ | ✅* |
| Xem tất cả chấm công | ✅ | ❌ | ❌ | ✅ | ❌ |
| Duyệt chấm công | ✅ | ✅ | ❌ | ✅ | ❌ |
| Sửa chấm công | ✅ | ❌ | ❌ | ✅ | ❌ |
| **└── Chức năng: Nhập thông tin cơ bản, hồ sơ tuyển dụng
├── ✏️ Chỉnh sửa nhân viên (hr:edit_employee)
│   └── Quyền: Cập nhật thông tin nhân viên
│   └── Phạm vi: Có thể giới hạn cho phòng ban của mình
└── 💰 Xem lương (hr:view_salary)
    └── Quyền: Xem thông tin lương
    └── Phạm vi: Có thể giới hạn cho phòng ban của mình
```

**Tổng số quyền**: 4 permissions
Chấm công + Admin
└── 24 permissions

Cấp độ 2: MANAGERS
├── CRM Manager
│   ├── Quản lý toàn bộ CRM
│   ├── Quản lý chấm công team
│   └── 11 permissions (CRM + Attendance)
│
└── HR Manager
    ├── Quản lý toàn bộ HR
    ├── Quản lý chấm công toàn công ty
    └── 12 permissions (HR + Attendance)

Cấp độ 3: STAFF
├── Sale
│   ├── Quản lý khách hàng của mình
│   ├── Chấm công cá nhân
│   └── 7 permissions (Own CRM + Self Attendance)
│
└── HR Staff
    ├── Hỗ trợ HR trong phòng ban
    ├── Chấm công + xem phòng ban
    └── 8 permissions (Department HR + Attendanc|
| Xóa khách hàng | ✅ | ❌ | ❌ | ❌ | ❌ |
| Chuyển khách hàng | ✅ | ✅ | ❌ | ❌ | ❌ |
| Xem lịch sử KH | ✅ | ✅ | ✅ | ❌ | ❌ |
| **HR Module** |
| Xem tất cả nhân viên | ✅ | ❌ | ❌ | ✅ | ❌ |
| Xem NV phòng ban | ✅ | ❌ | ❌ | ✅ | ✅ |
| Tạo nhân viên | ✅ | ❌ | ❌ | ✅ | ✅ |
| Sửa nhân viên | ✅ | ❌ | ❌ | ✅ | ✅* |
| Xóa nhân viên | ✅ | ❌ | ❌ | ✅ | ❌ |
| Xem lương | ✅ | ❌ | ❌ | ✅ | ✅* |
| Sửa lương | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Admin Module** |
| Xem audit log | ✅ | ❌ | ❌ | ❌ | ❌ |
| Quản lý users | ✅ | ❌ | ❌ | ❌ | ❌ |
| Quản lý roles | ✅ | ❌ | ❌ | ❌ | ❌ |
| Xem tất cả dữ liệu | ✅ | ❌ | ❌ | ❌ | ❌ |

**Chú thích:**
- ✅ = Có quyền đầy đủ
- ✅* = Có quyền nhưng giới hạn phạm vi (chỉ dữ liệu của mình/phòng ban)
- ❌ = Không có quyền

---

## 🔒 PHÂN CẤP QUYỀN HẠN

```
Cấp độ 1: ADMIN
├── Toàn quyền hệ thống
├── Quản lý CRM + HR + Admin
└── 16 permissions

Cấp độ 2: MANAGERS
├── CRM Manager
│   ├── Quản lý toàn bộ CRM
│   └── 5 permissions (CRM only)
│
└── HR Manager
    ├── Quản lý toàn bộ HR
    └── 6 permissions (HR only)

Cấp độ 3: STAFF
├── Sale
│   ├── Quản lý khách hàng của mình
│   └── 4 permissions (Own data only)
│
└── HR Staff
    ├── Hỗ trợ HR trong phòng ban
    └── 4 permissions (Department scope)
```

---

## 🛡️ CƠ CHẾ KIỂM SOÁT QUYỀN HẠN

### 1. Permission Check
```typescript
// Kiểm tra quyền đơn lẻ
hasPermission(permission: Permission): boolean

// Kiểm tra bất kỳ quyền nào
hasAnyPermission(permissions: Permission[]): boolean

// Kiểm tra tất cả quyền
hasAllPermissions(permissions: Permission[]): boolean
```

### 2. Route Protection
```typescript
// Protected Route với permission check
<ProtectedRoute 
  requiredPermissions={['crm:view_all_customers']}
  requireAll={false}
/>
```

### 3. Component Level
```typescript
// Permission Guard trong component
<PermissionGuard permission="hr:edit_salary">
  <EditSalaryButton />
</PermissionGuard>
```

### 4. Data Scope Filtering
```typescript
// Lọc dữ liệu theo quyền
// Sale: chỉ xem khách hàng của mình
const customers = allCustomers.filter(c => 
  c.assignedTo === currentUser.id
);

// HR Staff: chỉ xem nhân viên cùng phòng
const employees = allEmployees.filter(e => 
  e.departmentId === currentUser.departmentId
);
```

---

## 📝 LƯU Ý QUAN TRỌNG

### ⚠️ Quy tắc phân quyền
1. **Principle of Least Privilege**: Mỗi role chỉ có quyền tối thiểu cần thiết
2. **Separation of Duties**: CRM và HR được tách biệt hoàn toàn
3. **Data Ownership**: Sale/HR Staff chỉ truy cập dữ liệu thuộc phạm vi của mình
4. **Admin Override**: Admin có toàn quyền nhưng mọi thao tác đều được ghi log

### 🔐 Bảo mật
- Tất cả permissions được validate ở cả frontend và backend
- Audit log ghi lại mọi thao tác quan trọng
- Session timeout sau 30 phút không hoạt động
- Force logout khi role/permissions thay đổi

### 📊 Mở rộng trong tương lai
- Custom roles với permission tùy chỉnh
- Dynamic permission assignment
- Role hierarchy với inheritance
- Time-based permissions (quyền tạm thời)
- Geo-based permissions (quyền theo vị trí)

---

**Ngày cập nhật**: 21/01/2026  
**Phiên bản**: 1.0  
**Tác giả**: HR Admin System Team
