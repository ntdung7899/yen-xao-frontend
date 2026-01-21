import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Badge,
  theme,
  Breadcrumb,
} from "antd";
import type { MenuProps } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  ApartmentOutlined,
  IdcardOutlined,
  DashboardOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  CustomerServiceOutlined,
  SafetyOutlined,
  FileTextOutlined,
  CrownOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const { user, logout, hasAnyPermission } = useAuth();

  // Build menu items based on permissions
  const getMenuItems = (): MenuProps["items"] => {
    const items: MenuProps["items"] = [];

    // Admin menu
    if (hasAnyPermission(["admin:view_all_data", "admin:view_audit_log"])) {
      items.push({
        key: "admin",
        icon: <CrownOutlined />,
        label: "Admin",
        children: [
          hasAnyPermission(["admin:view_all_data"]) && {
            key: "/admin/overview",
            icon: <DashboardOutlined />,
            label: "Tổng quan",
          },
          hasAnyPermission(["admin:view_audit_log"]) && {
            key: "/admin/audit-log",
            icon: <FileTextOutlined />,
            label: "Audit Log",
          },
        ].filter(Boolean) as MenuProps["items"],
      });
    }

    // CRM menu
    if (
      hasAnyPermission([
        "crm:view_all_customers",
        "crm:view_own_customers",
      ])
    ) {
      items.push({
        key: "crm",
        icon: <CustomerServiceOutlined />,
        label: "CRM",
        children: [
          {
            key: "/crm/customers",
            icon: <TeamOutlined />,
            label: "Khách hàng",
          },
        ],
      });
    }

    // HR menu
    if (
      hasAnyPermission([
        "hr:view_all_employees",
        "hr:view_department_employees",
      ])
    ) {
      items.push({
        key: "hr",
        icon: <SafetyOutlined />, 
        label: "HR",
        children: [
          {
            key: "/hr/dashboard",
            icon: <DashboardOutlined />, 
            label: "Dashboard",
          },
          {
            key: "/hr/employees",
            icon: <TeamOutlined />, 
            label: "Nhân viên",
          },
          {
            key: "/hr/departments",
            icon: <ApartmentOutlined />, 
            label: "Phòng ban",
          },
          {
            key: "/hr/positions",
            icon: <IdcardOutlined />, 
            label: "Chức vụ",
          },
          hasAnyPermission(["hr:view_salary", "hr:view_own_salary"]) && {
            key: "/hr/salaries",
            icon: <DollarOutlined />,
            label: "Lương",
          },
        ].filter(Boolean) as MenuProps["items"],
      });
    }

    // Attendance menu
    if (hasAnyPermission(["attendance:checkin", "attendance:view_own"])) {
      items.push({
        key: "/hr/attendance",
        icon: <ClockCircleOutlined />,
        label: "Chấm công",
      });
    }

    return items;
  };

  const menuItems = getMenuItems();

  // User dropdown menu
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      logout();
      navigate("/login");
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ của tôi",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
      onClick: handleMenuClick,
    },
  ];

  // Get current path for menu selection
  const selectedKey = location.pathname;

  // Get breadcrumb items based on current path
  const getBreadcrumbItems = () => {
    const pathSnippets = location.pathname.split("/").filter((i) => i);
    const breadcrumbItems = [
      {
        title: "Trang chủ",
      },
    ];

    pathSnippets.forEach((snippet) => {
      let title = snippet;

      // Convert to Vietnamese
      if (snippet === "admin") title = "Quản trị";
      else if (snippet === "overview") title = "Tổng quan";
      else if (snippet === "audit-log") title = "Nhật ký";
      else if (snippet === "crm") title = "CRM";
      else if (snippet === "customers") title = "Khách hàng";
      else if (snippet === "hr") title = "Nhân sự";
      else if (snippet === "employees") title = "Nhân viên";
      else if (snippet === "departments") title = "Phòng ban";
      else if (snippet === "positions") title = "Chức vụ";
      else if (snippet === "salaries") title = "Lương";
      else if (snippet === "dashboard") title = "Dashboard";
      else if (snippet === "new") title = "Thêm mới";

      breadcrumbItems.push({
        title,
      });
    });

    return breadcrumbItems;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => {
          if (broken) setCollapsed(true);
        }}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: collapsed ? 18 : 20,
            fontWeight: "bold",
            borderBottom: `1px solid ${token.colorBorder}`,
          }}
        >
          {collapsed ? "🏢" : "🏢 CRM + HR"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ marginTop: 8 }}
        />
      </Sider>

      {/* Main Layout */}
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "all 0.2s" }}>
        {/* Header */}
        <Header
          style={{
            padding: "0 24px",
            background: token.colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 1,
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 48,
              height: 48,
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Notifications */}
            <Badge count={5} size="small">
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: 18 }} />}
                style={{ width: 48, height: 48 }}
              />
            </Badge>

            {/* User Avatar & Dropdown */}
            <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} placement="bottomRight">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: 4,
                  transition: "background 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = token.colorBgTextHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Avatar
                  size="default"
                  style={{ backgroundColor: token.colorPrimary }}
                >
                  {user?.fullName?.charAt(0) || "U"}
                </Avatar>
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "flex-start",
                  lineHeight: 1.2,
                }}>
                  <span style={{ fontWeight: 500, fontSize: 14, color: token.colorText }}>
                    {user?.fullName || "User"}
                  </span>
                  <span style={{ 
                    fontSize: 12, 
                    color: token.colorTextSecondary, 
                    textTransform: "capitalize" 
                  }}>
                    {user?.role?.replace("_", " ") || "User"}
                  </span>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: "24px 16px",
            minHeight: 280,
          }}
        >
          {/* Breadcrumb */}
          <Breadcrumb
            items={getBreadcrumbItems()}
            style={{ marginBottom: 16 }}
          />

          {/* Page Content */}
          <div
            style={{
              padding: 24,
              background: token.colorBgContainer,
              borderRadius: token.borderRadius,
              minHeight: "calc(100vh - 180px)",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
