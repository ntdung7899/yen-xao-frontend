import { useState, useEffect } from "react";
import { Card, Avatar, Descriptions, Tag, Row, Col, Typography, Statistic } from "antd";
import { UserOutlined, SafetyCertificateOutlined, DollarOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import { PERMISSION_LABELS } from "../../constants/permissions.constants";
import { getEmployeeById } from "../../data/mockData";
import { formatCurrency } from "../../utils/formatters";
import { Employee } from "../../types/hr.types";

const { Title } = Typography;

const UserProfile = () => {
    const { user } = useAuth();
    const [employee, setEmployee] = useState<Employee | null>(null);
    useEffect(() => {
        if (user) {
            const emp = getEmployeeById(user.id);
            setEmployee(emp || null);
        }
    }, [user]);

    if (!user) {
        return null;
    }

    // Mock commission calculation (10% for sales, 0 otherwise)
    const commission = user.role === 'sale' && employee ? employee.baseSalary * 0.1 : 0;

    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <Card>
                <Row gutter={[24, 24]} align="middle">
                    <Col xs={24} sm={8} style={{ textAlign: "center" }}>
                        <Avatar
                            size={120}
                            icon={<UserOutlined />}
                            src={user.avatar}
                            style={{ backgroundColor: "#1677ff", marginBottom: 16 }}
                        >
                            {user.fullName?.[0]}
                        </Avatar>
                        <Title level={4} style={{ marginBottom: 4 }}>
                            {user.fullName}
                        </Title>
                        <Tag color="blue">{user.role.replace("_", " ").toUpperCase()}</Tag>
                    </Col>
                    <Col xs={24} sm={16}>
                        <Descriptions title="Thông tin tài khoản" layout="vertical" column={1}>
                            <Descriptions.Item label="Tên đăng nhập">
                                {user.username}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {user.email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={user.isActive ? "green" : "red"}>
                                    {user.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Quyền hạn">
                                <div style={{ maxHeight: 200, overflowY: "auto" }}>
                                    {user.permissions.map((perm) => (
                                        <Tag key={perm} style={{ margin: "4px 4px 4px 0" }}>
                                            {PERMISSION_LABELS[perm] || perm}
                                        </Tag>
                                    ))}
                                </div>
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </Card>

            {employee && (
                <Card style={{ marginTop: 16 }} title={<><DollarOutlined /> Thông tin thu nhập</>}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Statistic
                                title="Lương cơ bản"
                                value={employee.baseSalary}
                                formatter={(value) => formatCurrency(Number(value))}
                            />
                        </Col>
                        <Col span={12}>
                            <Statistic
                                title="Hoa hồng (Ước tính)"
                                value={commission}
                                precision={0}
                                valueStyle={{ color: '#3f8600' }}
                                formatter={(value) => formatCurrency(Number(value))}
                            />
                        </Col>
                    </Row>
                </Card>
            )}

            <Card style={{ marginTop: 16 }} title={<><SafetyCertificateOutlined /> Thông tin bảo mật</>}>
                <p>Mật khẩu: **********</p>
                {/* Add password change feature here later if needed */}
            </Card>
        </div>
    );
};

export default UserProfile;
