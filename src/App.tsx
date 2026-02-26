import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider, Spin } from "antd";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/guards/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

// Lazy-loaded Pages — each becomes a separate chunk
// Auth Pages
const LoginPage = React.lazy(() => import("./pages/auth/LoginPage").then(m => ({ default: m.LoginPage })));
const AccessDeniedPage = React.lazy(() => import("./pages/auth/AccessDeniedPage").then(m => ({ default: m.AccessDeniedPage })));

// Common Pages
const UserProfile = React.lazy(() => import("./pages/common/UserProfile"));

// HR Pages
const Dashboard = React.lazy(() => import("./pages/hr/Dashboard"));
const EmployeeList = React.lazy(() => import("./pages/hr/EmployeeList"));
const EmployeeDetail = React.lazy(() => import("./pages/hr/EmployeeDetail"));
const DepartmentList = React.lazy(() => import("./pages/hr/DepartmentList"));
const PositionList = React.lazy(() => import("./pages/hr/PositionList"));
const AttendancePage = React.lazy(() => import("./pages/hr/AttendancePage"));
const SalariesPage = React.lazy(() => import("./pages/hr/SalariesPage"));
const LeaveRequestList = React.lazy(() => import("./pages/hr/LeaveRequestList"));

// CRM Pages
const CustomerList = React.lazy(() => import("./pages/crm/CustomerList").then(m => ({ default: m.CustomerList })));
const CustomerDetail = React.lazy(() => import("./pages/crm/CustomerDetail").then(m => ({ default: m.CustomerDetail })));
const WorkSchedule = React.lazy(() => import("./pages/crm/WorkSchedule"));
const CRMDashboard = React.lazy(() => import("./pages/crm/Dashboard"));

// Admin Pages
const AdminOverview = React.lazy(() => import("./pages/admin/AdminOverview").then(m => ({ default: m.AdminOverview })));
const AuditLogPage = React.lazy(() => import("./pages/admin/AuditLogPage").then(m => ({ default: m.AuditLogPage })));
const UserManagement = React.lazy(() => import("./pages/admin/UserManagement"));

// E-commerce Pages
const BannerList = React.lazy(() => import("./pages/ecommerce/BannerList"));
const ProductList = React.lazy(() => import("./pages/ecommerce/ProductList"));
const NewsList = React.lazy(() => import("./pages/ecommerce/NewsList"));

// Loading fallback for lazy-loaded pages
const PageLoading = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
    <Spin size="large" tip="Đang tải..." />
  </div>
);

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
          <Suspense fallback={<PageLoading />}>
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
                  path="crm/dashboard"
                  element={
                    <ProtectedRoute
                      requiredPermissions={["crm:view_all_customers"]}
                    >
                      <CRMDashboard />
                    </ProtectedRoute>
                  }
                />
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
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
