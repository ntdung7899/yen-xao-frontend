import { Row, Col, Card, Statistic, Typography } from "antd";
import {
    TeamOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    SyncOutlined,
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
    FunnelChart,
    Funnel,
    LabelList
} from "recharts";
import { mockCustomers, mockUsers, mockDepartments } from "@/data/mockAuthData";

const { Title } = Typography;

const CRMDashboard = () => {
    // Stats
    const totalCustomers = mockCustomers.length;
    const totalValue = mockCustomers.reduce((sum, c) => sum + (c.totalValue || 0), 0);
    const totalLeads = mockCustomers.filter(c => c.status === 'lead').length;
    const totalProspects = mockCustomers.filter(c => c.status === 'prospect').length;
    const totalActiveCustomers = mockCustomers.filter(c => c.status === 'customer').length;

    // Pipeline Data (Funnel)
    const pipelineData = [
        { name: "Lead", value: totalLeads, fill: "#1677ff" },
        { name: "Prospect", value: totalProspects, fill: "#faad14" },
        { name: "Customer", value: totalActiveCustomers, fill: "#52c41a" },
    ];

    // Customers by Department (Derived from Assignee)
    // Map Department ID to Count
    const deptCounts: Record<string, number> = {};
    mockDepartments.forEach(d => deptCounts[d.id] = 0);

    mockCustomers.forEach(c => {
        const assignee = mockUsers.find(u => u.id === c.assignedTo);
        if (assignee?.departmentId) {
            deptCounts[assignee.departmentId] = (deptCounts[assignee.departmentId] || 0) + 1;
        }
    });

    const deptData = mockDepartments.map(d => ({
        name: d.name,
        count: deptCounts[d.id] || 0
    })).filter(d => d.count > 0);

    // Region Data (Mocking Regions based on Team or Random for visualization as requested "Khu vực")
    // Since we don't have explicit Region in mock data, I will simulate it based on 'Team' if available or just hardcode some distribution for the sake of the requirement "Xem khách theo khu vực"
    // Assuming Team 1 is North, Team 2 is South.
    const regionData = [
        { name: "Miền Bắc", value: mockCustomers.filter((_, i) => i % 2 === 0).length },
        { name: "Miền Nam", value: mockCustomers.filter((_, i) => i % 2 !== 0).length },
    ];

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div>
            <Title level={2} style={{ marginBottom: 24 }}>
                CRM Dashboard
            </Title>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng khách hàng"
                            value={totalCustomers}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: "#1677ff" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Doanh số dự kiến"
                            value={totalValue}
                            precision={0}
                            suffix="đ"
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: "#cf1322" }}
                            formatter={(value) => `${Number(value).toLocaleString('vi-VN')}`}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Leads Mới"
                            value={totalLeads}
                            prefix={<SyncOutlined spin />}
                            valueStyle={{ color: "#faad14" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Khách hàng chốt"
                            value={totalActiveCustomers}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card title="Sales Pipeline (Phễu bán hàng)">
                        <ResponsiveContainer width="100%" height={300}>
                            <FunnelChart>
                                <Tooltip />
                                <Funnel
                                    dataKey="value"
                                    data={pipelineData}
                                    isAnimationActive
                                >
                                    <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                                </Funnel>
                            </FunnelChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Khách hàng theo Phòng ban (Phụ trách)">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={deptData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8884d8" name="Số lượng khách" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Phân bố theo Khu vực (Giả lập)">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={regionData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomLabel}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {regionData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CRMDashboard;
