import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/hr/Dashboard";
import EmployeeList from "./pages/hr/EmployeeList";
import EmployeeDetail from "./pages/hr/EmployeeDetail";
import DepartmentList from "./pages/hr/DepartmentList";
import PositionList from "./pages/hr/PositionList";

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
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/hr/dashboard" replace />} />
          
          {/* HR Module Routes */}
          <Route path="/hr" element={<MainLayout />}>
            {/* Redirect /hr to /hr/dashboard */}
            <Route index element={<Navigate to="/hr/dashboard" replace />} />
            
            {/* Dashboard */}
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Employee Routes */}
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/:id" element={<EmployeeDetail />} />
            
            {/* Department Routes */}
            <Route path="departments" element={<DepartmentList />} />
            
            {/* Position Routes */}
            <Route path="positions" element={<PositionList />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<Navigate to="/hr/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
