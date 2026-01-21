# 🏗️ KIẾN TRÚC HỆ THỐNG - CRM + HR Frontend

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    React App (SPA)                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │            AuthProvider (Context)                │   │
│  │  - User state                                     │   │
│  │  - Permissions                                    │   │
│  │  - Login/Logout logic                             │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                               │
│  ┌───────────────────────┴────────────────────────┐   │
│  │                                                   │   │
│  │   ProtectedRoute          PermissionGuard       │   │
│  │   (Route level)           (Component level)     │   │
│  │                                                   │   │
│  └───────────────────────┬────────────────────────┘   │
│                          │                               │
│  ┌───────────────────────┴────────────────────────┐   │
│  │                                                   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐     │   │
│  │  │  Admin   │  │   CRM    │  │    HR    │     │   │
│  │  │  Pages   │  │  Pages   │  │  Pages   │     │   │
│  │  └──────────┘  └──────────┘  └──────────┘     │   │
│  │                                                   │   │
│  └───────────────────────────────────────────────┘   │
│                          │                               │
│  ┌───────────────────────┴────────────────────────┐   │
│  │              Mock Data Layer                     │   │
│  │  - mockUsers                                      │   │
│  │  - mockCustomers                                  │   │
│  │  - mockEmployees                                  │   │
│  │  - mockAuditLogs                                  │   │
│  └───────────────────────────────────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## 🔐 Authorization Flow

```
User Login
    ↓
Check credentials (mockUsers)
    ↓
Create session (localStorage + AuthContext)
    ↓
Navigate to protected route
    ↓
ProtectedRoute checks permissions
    ↓
┌─────────────┐
│ Has Access? │
└─────────────┘
    ├─ YES → Render Page
    │           ↓
    │     Check component permissions
    │           ↓
    │     PermissionGuard filters UI
    │           ↓
    │     Filter data by role
    │           ↓
    │     Render allowed data only
    │
    └─ NO  → Redirect to /access-denied
```

## 🎯 Permission Matrix

| Role         | CRM View All | CRM View Own | CRM Transfer | HR View All | HR View Dept | HR Edit Salary | Admin |
|--------------|--------------|--------------|--------------|-------------|--------------|----------------|-------|
| Admin        | ✅           | ✅           | ✅           | ✅          | ✅           | ✅             | ✅    |
| CRM Manager  | ✅           | ✅           | ✅           | ❌          | ❌           | ❌             | ❌    |
| Sale         | ❌           | ✅           | ❌           | ❌          | ❌           | ❌             | ❌    |
| HR Manager   | ❌           | ❌           | ❌           | ✅          | ✅           | ✅             | ❌    |
| HR Staff     | ❌           | ❌           | ❌           | ❌          | ✅           | ❌             | ❌    |

## 📂 File Structure Detail

```
src/
├── components/
│   ├── guards/
│   │   ├── ProtectedRoute.tsx          # HOC cho route protection
│   │   │   └── Props: requiredPermissions[], requireAll?
│   │   └── PermissionGuard.tsx          # Component guard
│   │       └── Props: requiredPermissions[], hideIfNoAccess?, fallback?
│   └── layout/
│       └── MainLayout.tsx               # Layout với dynamic menu
│           └── Menu auto-generated based on permissions
│
├── contexts/
│   └── AuthContext.tsx                  # Global auth state
│       ├── user: User | null
│       ├── isAuthenticated: boolean
│       ├── login(username, password)
│       ├── logout()
│       ├── hasPermission(permission)
│       ├── hasAnyPermission(permissions[])
│       └── hasAllPermissions(permissions[])
│
├── data/
│   ├── mockData.ts                      # HR mock data (existing)
│   └── mockAuthData.ts                  # New auth data
│       ├── ROLE_PERMISSIONS: Record<Role, Permission[]>
│       ├── mockUsers: User[]
│       ├── mockCustomers: Customer[]
│       ├── mockCustomerHistory: CustomerHistory[]
│       ├── mockAuditLogs: AuditLog[]
│       └── TEST_CREDENTIALS
│
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx                # Login với demo accounts
│   │   └── AccessDeniedPage.tsx         # 403 page
│   │
│   ├── admin/
│   │   ├── AdminOverview.tsx            # Dashboard tổng quan
│   │   │   └── Stats, Charts, Recent activities
│   │   └── AuditLogPage.tsx             # Audit log viewer
│   │       └── Filterable table with action/entity/user/time
│   │
│   ├── crm/
│   │   ├── CustomerList.tsx             # Danh sách KH (filtered by role)
│   │   │   ├── Data filtering: view_all vs view_own
│   │   │   ├── Search & Filter
│   │   │   └── Conditional buttons (Transfer, Create)
│   │   └── CustomerDetail.tsx           # Chi tiết KH
│   │       ├── Customer info
│   │       ├── History (permission-gated)
│   │       └── Transfer button (permission-gated)
│   │
│   └── hr/
│       ├── Dashboard.tsx                # HR Dashboard
│       ├── EmployeeList.tsx             # Danh sách NV (với permission check)
│       ├── EmployeeDetail.tsx           # Chi tiết NV
│       ├── DepartmentList.tsx           # Phòng ban
│       └── PositionList.tsx             # Chức vụ
│
├── types/
│   ├── auth.types.ts                    # Auth & Permission types
│   │   ├── Role: 'admin' | 'hr_manager' | 'crm_manager' | 'sale' | 'hr_staff'
│   │   ├── Permission: 35+ permissions
│   │   ├── User interface
│   │   └── AuthState interface
│   │
│   ├── crm.types.ts                     # CRM types
│   │   ├── Customer
│   │   ├── CustomerHistory
│   │   ├── CustomerTransfer
│   │   └── Team
│   │
│   ├── hr.types.ts                      # HR types (existing)
│   │   ├── Employee
│   │   ├── Department
│   │   └── Position
│   │
│   └── audit.types.ts                   # Audit types
│       ├── AuditLog
│       ├── AuditAction
│       └── AuditEntity
│
└── App.tsx                              # Main app với routing
    ├── AuthProvider wrapper
    ├── Public routes: /login, /access-denied
    └── Protected routes với nested permission checks
```

## 🔄 Data Flow Examples

### Example 1: User Login Flow
```typescript
// 1. User enters credentials
LoginPage → useAuth().login(username, password)

// 2. Validate against TEST_CREDENTIALS
AuthContext → find user in mockUsers

// 3. Set user state
setUser(foundUser)
localStorage.setItem('currentUser', JSON.stringify(foundUser))

// 4. Create audit log
mockAuditLogs.unshift({ action: 'login', userId, timestamp, ... })

// 5. Navigate to home
navigate('/')

// 6. ProtectedRoute checks authentication
if (!isAuthenticated) → Navigate to /login
```

### Example 2: CRM Customer List (Sale User)
```typescript
// 1. Sale user navigates to /crm/customers
Router → ProtectedRoute checks ['crm:view_all_customers', 'crm:view_own_customers']

// 2. Has 'crm:view_own_customers' → Allow access
CustomerList page renders

// 3. Filter customers by assignedTo
const visibleCustomers = hasPermission('crm:view_all_customers')
  ? mockCustomers
  : mockCustomers.filter(c => c.assignedTo === user.id)

// 4. Render only 2 customers (assigned to this user)
Table renders with filtered data

// 5. Check Transfer button permission
<PermissionGuard requiredPermissions={['crm:transfer_customer']}>
  <button>Chuyển</button> ❌ HIDDEN (sale không có quyền)
</PermissionGuard>
```

### Example 3: Admin Audit Log
```typescript
// 1. Admin navigates to /admin/audit-log
ProtectedRoute checks ['admin:view_audit_log'] ✅

// 2. AuditLogPage renders
Load mockAuditLogs from memory

// 3. Apply filters
Filter by action, entity, user, timestamp, success

// 4. Display table
Show all filtered logs with details

// 5. Real-time updates
Every action in app → mockAuditLogs.unshift(newLog)
Re-render automatically
```

## 🎨 UI Components Behavior

### PermissionGuard Component
```tsx
// Usage 1: Hide completely
<PermissionGuard requiredPermissions={['crm:transfer_customer']}>
  <button>Chuyển khách hàng</button>
</PermissionGuard>
// No permission → Nothing rendered

// Usage 2: Show fallback
<PermissionGuard
  requiredPermissions={['hr:edit_salary']}
  hideIfNoAccess={false}
  fallback={<button disabled>Chỉnh sửa (Không có quyền)</button>}
>
  <button>Chỉnh sửa lương</button>
</PermissionGuard>
// No permission → Disabled button shown
```

### Dynamic Menu Generation
```tsx
// MainLayout.tsx
const getMenuItems = () => {
  const items = [];
  
  // Admin menu
  if (hasAnyPermission(['admin:view_all_data', 'admin:view_audit_log'])) {
    items.push({ key: 'admin', label: 'Admin', children: [...] });
  }
  
  // CRM menu
  if (hasAnyPermission(['crm:view_all_customers', 'crm:view_own_customers'])) {
    items.push({ key: 'crm', label: 'CRM', children: [...] });
  }
  
  // HR menu
  if (hasAnyPermission(['hr:view_all_employees', 'hr:view_department_employees'])) {
    items.push({ key: 'hr', label: 'HR', children: [...] });
  }
  
  return items;
};

// Result:
// Admin    → [Admin, CRM, HR]
// CRM Mgr  → [CRM]
// Sale     → [CRM]
// HR Mgr   → [HR]
// HR Staff → [HR]
```

## 🔒 Security Implementation

### 1. Route Level Protection
```tsx
<ProtectedRoute requiredPermissions={['admin:view_all_data']}>
  <AdminOverview />
</ProtectedRoute>

// Flow:
isAuthenticated? → NO → /login
hasPermission('admin:view_all_data')? → NO → /access-denied
hasPermission('admin:view_all_data')? → YES → Render page
```

### 2. Component Level Protection
```tsx
<PermissionGuard requiredPermissions={['crm:transfer_customer']}>
  <TransferButton />
</PermissionGuard>

// Flow:
hasPermission('crm:transfer_customer')? → NO → Render nothing
hasPermission('crm:transfer_customer')? → YES → Render button
```

### 3. Data Level Protection
```tsx
// Filter data before rendering
const visibleCustomers = useMemo(() => {
  if (hasPermission('crm:view_all_customers')) {
    return allCustomers;
  }
  if (hasPermission('crm:view_own_customers')) {
    return allCustomers.filter(c => c.assignedTo === user.id);
  }
  return [];
}, [allCustomers, user, permissions]);
```

## 📊 State Management

### Authentication State (React Context)
```typescript
interface AuthState {
  user: User | null;                  // Current logged-in user
  isAuthenticated: boolean;           // Auth status
  login: (username, password) => boolean;
  logout: () => void;
  hasPermission: (permission) => boolean;
  hasAnyPermission: (permissions[]) => boolean;
  hasAllPermissions: (permissions[]) => boolean;
}

// Persistence:
localStorage.setItem('currentUser', JSON.stringify(user))
// Restore on app load
```

### Mock Data State (Module-level)
```typescript
// In mockAuthData.ts
export let mockCustomers = [...];
export let mockAuditLogs = [...];

// Mutation:
mockAuditLogs.unshift(newLog);      // Add log
mockCustomers[index] = updated;     // Update customer

// Note: Data lost on refresh (mock only)
```

## 🎯 Key Design Decisions

### 1. **Permission-based vs Role-based**
- ✅ Sử dụng Permissions (granular)
- ✅ Mỗi Role có list Permissions
- ✅ Check permission, không check role trực tiếp
- **Why**: Flexibility, dễ mở rộng

### 2. **Context API vs Redux**
- ✅ Chọn Context API
- **Why**: Simple app, không cần complex state management

### 3. **Route Protection Strategy**
- ✅ HOC (ProtectedRoute) wrap route
- ✅ Check permission trước khi render
- ✅ Redirect nếu không có quyền
- **Why**: Centralized, reusable, secure

### 4. **UI Hiding Strategy**
- ✅ Component-level guard (PermissionGuard)
- ✅ Conditional rendering
- ✅ Optional fallback UI
- **Why**: Clean UI, không show disabled buttons cho user không có quyền

### 5. **Data Filtering**
- ✅ Filter ở component level
- ✅ Based on user's permissions
- ✅ Use useMemo for performance
- **Why**: Security + UX, user không thấy data không được phép

## 🚀 Performance Considerations

### Memoization
```tsx
const visibleCustomers = useMemo(() => {
  // Heavy filtering logic
}, [customers, user, permissions]);
```

### Lazy Loading (Future)
```tsx
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
```

### Permission Caching
```tsx
// Permissions stored in user object (AuthContext)
// No re-computation on every check
```

## 🔮 Future Enhancements

### Backend Integration
- Replace mock data with API calls
- JWT authentication
- Real database
- Server-side permission validation

### Advanced Features
- Real-time notifications (WebSocket)
- Export to Excel/PDF
- Advanced analytics
- File upload
- Email integration

### Performance
- Code splitting
- Lazy loading routes
- Service Worker (PWA)
- Caching strategy

---

**Kiến trúc được thiết kế để dễ maintain, mở rộng và test!** ✨
