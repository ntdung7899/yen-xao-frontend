import React from 'react';
import { Card, Row, Col, Statistic, Progress, Timeline, Tag, Avatar } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  SafetyOutlined,
  RiseOutlined,
  CrownOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { mockCustomers, mockEmployees, mockUsers, mockAuditLogs } from '../../data/mockAuthData';

export const AdminOverview: React.FC = () => {
  const { user } = useAuth();

  const stats = {
    totalCustomers: mockCustomers.length,
    activeCustomers: mockCustomers.filter((c) => c.status === 'customer').length,
    totalEmployees: mockEmployees.length,
    activeEmployees: mockEmployees.filter((e) => e.status === 'active').length,
    totalUsers: mockUsers.length,
    activeUsers: mockUsers.filter((u) => u.isActive).length,
    totalRevenue: mockCustomers.reduce((sum, c) => sum + c.totalValue, 0),
    recentActivities: mockAuditLogs.slice(0, 10),
  };

  const roleDistribution = mockUsers.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getRoleName = (role: string): string => {
    const names: Record<string, string> = {
      admin: 'Quản trị viên',
      crm_manager: 'Quản lý CRM',
      sale: 'Nhân viên Sale',
      hr_manager: 'Quản lý HR',
      hr_staff: 'Nhân viên HR',
    };
    return names[role] || role;
  };

  const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
      admin: '#f5222d',
      crm_manager: '#1890ff',
      sale: '#52c41a',
      hr_manager: '#722ed1',
      hr_staff: '#13c2c2',
    };
    return colors[role] || '#d9d9d9';
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Admin Dashboard</h1>
        <p style={{ fontSize: 16, color: '#8c8c8c' }}>Xin chào, {user?.fullName} 👋</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Tổng Khách hàng</span>}
              value={stats.totalCustomers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#fff', fontSize: 32 }}
              suffix={
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>
                  {stats.activeCustomers} hoạt động
                </div>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Tổng Nhân viên</span>}
              value={stats.totalEmployees}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#fff', fontSize: 32 }}
              suffix={
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>
                  {stats.activeEmployees} làm việc
                </div>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Doanh thu</span>}
              value={(stats.totalRevenue / 1000000).toFixed(1)}
              prefix={<DollarOutlined />}
              suffix={<span style={{ fontSize: 18 }}>M đ</span>}
              valueStyle={{ color: '#fff', fontSize: 32 }}
            />
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 8 }}>Tổng từ CRM</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Người dùng</span>}
              value={stats.totalUsers}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#fff', fontSize: 32 }}
              suffix={
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>
                  {stats.activeUsers} hoạt động
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Role Distribution & Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="📊 Phân bổ vai trò" bordered={false}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {Object.entries(roleDistribution).map(([role, count]) => (
                <div key={role}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 500 }}>{getRoleName(role)}</span>
                    <span style={{ color: '#8c8c8c' }}>
                      {count} ({((count / stats.totalUsers) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <Progress
                    percent={(count / stats.totalUsers) * 100}
                    strokeColor={getRoleColor(role)}
                    showInfo={false}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="📈 Thống kê nhanh" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small" style={{ background: '#e6f7ff', border: '1px solid #91d5ff' }}>
                  <Statistic
                    title="Lead mới"
                    value={mockCustomers.filter((c) => c.status === 'lead').length}
                    prefix={<RiseOutlined />}
                    valueStyle={{ color: '#1890ff', fontSize: 24 }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
                  <Statistic
                    title="Prospect"
                    value={mockCustomers.filter((c) => c.status === 'prospect').length}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: '#52c41a', fontSize: 24 }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ background: '#f9f0ff', border: '1px solid #d3adf7' }}>
                  <Statistic
                    title="VIP"
                    value={mockCustomers.filter((c) => c.priority === 'vip').length}
                    prefix={<CrownOutlined />}
                    valueStyle={{ color: '#722ed1', fontSize: 24 }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ background: '#fff7e6', border: '1px solid #ffd591' }}>
                  <Statistic
                    title="Hoạt động hôm nay"
                    value={
                      mockAuditLogs.filter((log) =>
                        log.timestamp.startsWith(new Date().toISOString().split('T')[0])
                      ).length
                    }
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#fa8c16', fontSize: 24 }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Card title="🕐 Hoạt động gần đây" bordered={false}>
        <Timeline
          items={stats.recentActivities.map((activity) => ({
            dot: activity.success ? (
              <CheckCircleOutlined style={{ fontSize: 16, color: '#52c41a' }} />
            ) : (
              <CloseCircleOutlined style={{ fontSize: 16, color: '#ff4d4f' }} />
            ),
            children: (
              <div style={{ paddingBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
                    {activity.userName.charAt(0)}
                  </Avatar>
                  <span style={{ fontWeight: 500 }}>{activity.userName}</span>
                  <Tag color="blue">{activity.action}</Tag>
                  <span style={{ color: '#8c8c8c', fontSize: 12 }}>
                    {new Date(activity.timestamp).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div style={{ color: '#595959', marginLeft: 32 }}>
                  {activity.description} • <span style={{ color: '#8c8c8c' }}>{activity.entity}</span>
                </div>
              </div>
            ),
          }))}
        />
      </Card>
    </div>
  );
};
