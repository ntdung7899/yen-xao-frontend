import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Result, Space, Tag, Typography } from 'antd';
import { HomeOutlined, LoginOutlined, StopOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Paragraph, Text } = Typography;

export const AccessDeniedPage: React.FC = () => {
  const { user } = useAuth();

  const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
      admin: 'purple',
      crm_manager: 'blue',
      sale: 'green',
      hr_manager: 'orange',
      hr_staff: 'magenta',
    };
    return colors[role] || 'default';
  };

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

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <Card
        style={{
          maxWidth: 600,
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          borderRadius: 16,
        }}
      >
        <Result
          status="403"
          icon={<StopOutlined style={{ color: '#ff4d4f' }} />}
          title={<span style={{ fontSize: 28, fontWeight: 700 }}>Truy cập bị từ chối</span>}
          subTitle={
            <Paragraph style={{ fontSize: 16, color: '#595959', marginTop: 16 }}>
              Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cần trợ giúp.
            </Paragraph>
          }
          extra={
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {user && (
                <Card size="small" style={{ background: '#fafafa' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Đang đăng nhập với vai trò:
                    </Text>
                    <div style={{ marginTop: 8 }}>
                      <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 8 }}>
                        {user.fullName}
                      </Text>
                      <Tag color={getRoleColor(user.role)} style={{ fontSize: 13 }}>
                        {getRoleName(user.role)}
                      </Tag>
                    </div>
                  </div>
                </Card>
              )}

              <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
                <Link to="/">
                  <Button type="primary" size="large" icon={<HomeOutlined />}>
                    Về trang chủ
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="large" icon={<LoginOutlined />}>
                    Đăng nhập lại
                  </Button>
                </Link>
              </Space>
            </Space>
          }
        />
      </Card>
    </div>
  );
};
