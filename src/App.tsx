import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/guards/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import UserProfile from "./pages/common/UserProfile";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { AccessDeniedPage } from "./pages/auth/AccessDeniedPage";

// HR Pages
import Dashboard from "./pages/hr/Dashboard";
import EmployeeList from "./pages/hr/EmployeeList";
import EmployeeDetail from "./pages/hr/EmployeeDetail";
import DepartmentList from "./pages/hr/DepartmentList";
import PositionList from "./pages/hr/PositionList";
import AttendancePage from "./pages/hr/AttendancePage";
import SalariesPage from "./pages/hr/SalariesPage";
import LeaveRequestList from "./pages/hr/LeaveRequestList";

// CRM Pages
import { CustomerList } from "./pages/crm/CustomerList";
import { CustomerDetail } from "./pages/crm/CustomerDetail";
import WorkSchedule from "./pages/crm/WorkSchedule";

// Admin Pages
import { AdminOverview } from "./pages/admin/AdminOverview";
import { AuditLogPage } from "./pages/admin/AuditLogPage";
import UserManagement from "./pages/admin/UserManagement";

// E-commerce Pages
import BannerList from "./pages/ecommerce/BannerList";
import ProductList from "./pages/ecommerce/ProductList";
import NewsList from "./pages/ecommerce/NewsList";

// Set dayjs locale to Vietnamese
dayjs.locale("vi");

// Helper component for smart redirect
const RootRedirect = () => {
  const { isAuthenticated, hasAnyPermission } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check permissions in order of priority
  if (hasAnyPermission(["admin:view_all_data"])) {
    return <Navigate to="/admin/overview" replace />;
  }

  if (hasAnyPermission(["crm:view_all_customers", "crm:view_own_customers"])) {
    return <Navigate to="/crm/customers" replace />;
  }

  if (hasAnyPermission(["hr:view_all_employees", "hr:view_department_employees"])) {
    return <Navigate to="/hr/dashboard" replace />;
  }

  if (hasAnyPermission(["attendance:checkin", "attendance:view_own"])) {
    return <Navigate to="/hr/attendance" replace />;
  }

  // Default fallback
  return <Navigate to="/access-denied" replace />;
};

const MyProfile = () => {
  return (
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  );
};

function App() {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 6,
        },
      }}
    >
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/access-denied" element={<AccessDeniedPage />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              {/* Smart Redirect based on role/permissions */}
              <Route index element={<RootRedirect />} />

              {/* Profile Route */}
              <Route path="profile" element={<MyProfile />} />

              {/* Admin Routes */}
              <Route
                path="admin/overview"
                element={
                  <ProtectedRoute requiredPermissions={["admin:view_all_data"]}>
                    <AdminOverview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/users"
                element={
                  <ProtectedRoute requiredPermissions={["admin:manage_users"]}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/audit-log"
                element={
                  <ProtectedRoute requiredPermissions={["admin:view_audit_log"]}>
                    <AuditLogPage />
                  </ProtectedRoute>
                }
              />

              {/* CRM Routes */}
              <Route
                path="crm/customers"
                element={
                  <ProtectedRoute
                    requiredPermissions={["crm:view_all_customers", "crm:view_own_customers"]}
                    requireAll={false}
                  >
                    <CustomerList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="crm/customers/:id"
                element={
                  <ProtectedRoute
                    requiredPermissions={["crm:view_all_customers", "crm:view_own_customers"]}
                    requireAll={false}
                  >
                    <CustomerDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="crm/work-schedule"
                element={
                  <ProtectedRoute
                    requiredPermissions={["crm:view_all_customers", "crm:view_own_customers"]} // Using base CRM permissions for now
                    requireAll={false}
                  >
                    <WorkSchedule />
                  </ProtectedRoute>
                }
              />

              {/* HR Routes */}
              <Route path="hr/dashboard" element={<Dashboard />} />
              <Route
                path="hr/requests-approval"
                element={
                  <ProtectedRoute
                    requiredPermissions={["attendance:approve"]}
                    requireAll={false}
                  >
                    <LeaveRequestList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="hr/attendance"
                element={
                  <ProtectedRoute
                    requiredPermissions={["attendance:checkin", "attendance:view_own"]}
                    requireAll={false}
                  >
                    <AttendancePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="hr/employees"
                element={
                  <ProtectedRoute
                    requiredPermissions={["hr:view_all_employees", "hr:view_department_employees", "hr:view_team_employees"]}
                    requireAll={false}
                  >
                    <EmployeeList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="hr/employees/:id"
                element={
                  <ProtectedRoute
                    requiredPermissions={["hr:view_all_employees", "hr:view_department_employees", "hr:view_team_employees"]}
                    requireAll={false}
                  >
                    <EmployeeDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="hr/departments"
                element={
                  <ProtectedRoute
                    requiredPermissions={["hr:view_all_employees", "hr:view_department_employees"]}
                    requireAll={false}
                  >
                    <DepartmentList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="hr/positions"
                element={
                  <ProtectedRoute
                    requiredPermissions={["hr:view_all_employees", "hr:view_department_employees"]}
                    requireAll={false}
                  >
                    <PositionList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="hr/salaries"
                element={
                  <ProtectedRoute
                    requiredPermissions={["hr:view_salary", "hr:view_own_salary"]}
                    requireAll={false}
                  >
                    <SalariesPage />
                  </ProtectedRoute>
                }
              />

              {/* E-commerce Routes */}
              <Route path="ecommerce/banners" element={<BannerList />} />
              <Route path="ecommerce/products" element={<ProductList />} />
              <Route path="ecommerce/news" element={<NewsList />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
