import { Row, Col, Card, Statistic, Typography } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  mockEmployees,
  mockDepartments,
  getDepartmentById,
  getEmployeesByDepartment,
} from "@/data/mockData";
import { formatCurrency } from "@/utils/formatters";

const { Title } = Typography;

const Dashboard = () => {
  // Calculate statistics
  const totalEmployees = mockEmployees.length;
  const activeEmployees = mockEmployees.filter(
    (emp) => emp.status === "active"
  ).length;
  const inactiveEmployees = mockEmployees.filter(
    (emp) => emp.status === "inactive"
  ).length;
  const resignedEmployees = mockEmployees.filter(
    (emp) => emp.status === "resigned"
  ).length;

  // Calculate new employees this month (mock: employees joined in last 30 days)
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const newEmployeesThisMonth = mockEmployees.filter((emp) => {
    const joinDate = new Date(emp.joinDate);
    return joinDate >= oneMonthAgo;
  }).length;

  // Calculate resigned this month
  const resignedThisMonth = mockEmployees.filter((emp) => {
    if (!emp.resignDate) return false;
    const resignDate = new Date(emp.resignDate);
    return resignDate >= oneMonthAgo;
  }).length;

  // Data for status pie chart
  const statusData = [
    { name: "Đang làm việc", value: activeEmployees, color: "#52c41a" },
    { name: "Tạm nghỉ", value: inactiveEmployees, color: "#faad14" },
    { name: "Đã nghỉ việc", value: resignedEmployees, color: "#ff4d4f" },
  ];

  // Data for department bar chart
  const departmentData = mockDepartments.map((dept) => ({
    name: dept.code,
    fullName: dept.name,
    count: getEmployeesByDepartment(dept.id).length,
  }));

  // Data for monthly trend (mock data for last 6 months)
  const monthlyData = [
    { month: "Tháng 8", new: 2, resigned: 1 },
    { month: "Tháng 9", new: 3, resigned: 0 },
    { month: "Tháng 10", new: 1, resigned: 1 },
    { month: "Tháng 11", new: 4, resigned: 2 },
    { month: "Tháng 12", new: 2, resigned: 0 },
    { month: "Tháng 1", new: newEmployeesThisMonth, resigned: resignedThisMonth },
  ];

  // Calculate average salary
  const averageSalary =
    mockEmployees.reduce((sum, emp) => sum + emp.baseSalary, 0) /
    mockEmployees.length;

  // Custom label for pie chart
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontWeight: "bold" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        Dashboard
      </Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số nhân viên"
              value={totalEmployees}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đang làm việc"
              value={activeEmployees}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#52c41a" }}
              suffix={
                <span style={{ fontSize: 14, color: "#666" }}>
                  / {totalEmployees}
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tuyển mới tháng này"
              value={newEmployeesThisMonth}
              prefix={<UserAddOutlined />}
              valueStyle={{ color: "#1677ff" }}
              suffix={<RiseOutlined style={{ fontSize: 14, color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Nghỉ việc tháng này"
              value={resignedThisMonth}
              prefix={<UserDeleteOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
              suffix={
                resignedThisMonth > 0 ? (
                  <FallOutlined style={{ fontSize: 14, color: "#ff4d4f" }} />
                ) : null
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Info Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Lương trung bình"
              value={averageSalary}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ fontSize: 18 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Số phòng ban"
              value={mockDepartments.length}
              suffix="phòng ban"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tỷ lệ đang làm"
              value={((activeEmployees / totalEmployees) * 100).toFixed(1)}
              suffix="%"
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tỷ lệ nghỉ việc"
              value={((resignedEmployees / totalEmployees) * 100).toFixed(1)}
              suffix="%"
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        {/* Status Pie Chart */}
        <Col xs={24} md={12}>
          <Card title="Trạng thái nhân viên">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Department Bar Chart */}
        <Col xs={24} md={12}>
          <Card title="Số lượng nhân viên theo phòng ban">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div
                          style={{
                            backgroundColor: "white",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                          }}
                        >
                          <p style={{ margin: 0, fontWeight: "bold" }}>
                            {payload[0].payload.fullName}
                          </p>
                          <p style={{ margin: 0, color: "#1677ff" }}>
                            Số nhân viên: {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#1677ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Monthly Trend Line Chart */}
        <Col xs={24}>
          <Card title="Xu hướng tuyển dụng và nghỉ việc (6 tháng gần đây)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="new"
                  stroke="#52c41a"
                  strokeWidth={2}
                  name="Tuyển mới"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="resigned"
                  stroke="#ff4d4f"
                  strokeWidth={2}
                  name="Nghỉ việc"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
