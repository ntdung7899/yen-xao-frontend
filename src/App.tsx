import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/guards/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

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

// CRM Pages
import { CustomerList } from "./pages/crm/CustomerList";
import { CustomerDetail } from "./pages/crm/CustomerDetail";

// Admin Pages
import { AdminOverview } from "./pages/admin/AdminOverview";
import { AuditLogPage } from "./pages/admin/AuditLogPage";

// Set dayjs locale to Vietnamese
dayjs.locale("vi");

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
              {/* Redirect root to appropriate dashboard based on role */}
              <Route index element={<Navigate to="/admin/overview" replace />} />

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

              {/* HR Routes */}
              <Route path="hr/dashboard" element={<Dashboard />} />
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
                    requiredPermissions={["hr:view_all_employees", "hr:view_department_employees"]}
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
                    requiredPermissions={["hr:view_all_employees", "hr:view_department_employees"]}
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
