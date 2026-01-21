import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Alert, Space, Tag, Divider, Collapse, Typography } from 'antd';
import { UserOutlined, LockOutlined, CrownOutlined, TeamOutlined, ShoppingOutlined, SafetyOutlined, FileTextOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { TEST_CREDENTIALS } from '../../data/mockAuthData';

const { Title, Paragraph, Text } = Typography;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (values: { username: string; password: string }) => {
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(values.username, values.password);
      if (success) {
        navigate('/');
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng');
      }
      setLoading(false);
    }, 500);
  };

  const quickLogin = (role: keyof typeof TEST_CREDENTIALS) => {
    const cred = TEST_CREDENTIALS[role];
    form.setFieldsValue({
      username: cred.username,
      password: cred.password,
    });
  };

  const getRoleIcon = (role: string) => {
    const icons: Record<string, React.ReactNode> = {
      admin: <CrownOutlined />,
      crm_manager: <TeamOutlined />,
      sale: <ShoppingOutlined />,
      hr_manager: <SafetyOutlined />,
      hr_staff: <FileTextOutlined />,
    };
    return icons[role] || <UserOutlined />;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'purple',
      crm_manager: 'blue',
      sale: 'green',
      hr_manager: 'orange',
      hr_staff: 'magenta',
    };
    return colors[role] || 'default';
  };

  const getRoleName = (role: string) => {
    const names: Record<string, string> = {
      admin: 'Admin',
      crm_manager: 'CRM Manager',
      sale: 'Sale',
      hr_manager: 'HR Manager',
      hr_staff: 'HR Staff',
    };
    return names[role] || role;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <Card
        style={{
          maxWidth: 450,
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          borderRadius: 16,
        }}
      >
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🏢</div>
          <Title level={2} style={{ marginBottom: 8 }}>
            CRM + HR System
          </Title>
          <Paragraph type="secondary">Đăng nhập để tiếp tục</Paragraph>
        </div>

        {/* Login Form */}
        <Form
          form={form}
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          size="large"
          autoComplete="off"
        >
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError('')}
              style={{ marginBottom: 24 }}
            />
          )}

          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập tên đăng nhập" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </Form.Item>
        </Form>

        <Divider>Tài khoản demo</Divider>

        {/* Demo Accounts */}
        <div style={{ marginBottom: 16 }}>
          <Paragraph type="secondary" style={{ marginBottom: 16, textAlign: 'center', fontSize: 13 }}>
            Click vào role để điền nhanh thông tin đăng nhập
          </Paragraph>
          <Space wrap style={{ width: '100%', justifyContent: 'center' }}>
            {Object.keys(TEST_CREDENTIALS).map((role) => (
              <Tag
                key={role}
                icon={getRoleIcon(role)}
                color={getRoleColor(role)}
                style={{ 
                  cursor: 'pointer', 
                  padding: '6px 12px', 
                  fontSize: 13,
                  fontWeight: 500,
                }}
                onClick={() => quickLogin(role as keyof typeof TEST_CREDENTIALS)}
              >
                {getRoleName(role)}
              </Tag>
            ))}
          </Space>
        </div>

        {/* Test Credentials */}
        <Collapse
          ghost
          size="small"
          items={[
            {
              key: '1',
              label: <Text type="secondary" style={{ fontSize: 13 }}>Xem thông tin đăng nhập</Text>,
              children: (
                <div style={{ background: '#fafafa', padding: 12, borderRadius: 8 }}>
                  {Object.entries(TEST_CREDENTIALS).map(([role, cred]) => (
                    <div
                      key={role}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '6px 0',
                        fontSize: 12,
                        fontFamily: 'monospace',
                      }}
                    >
                      <Text strong>{cred.username}</Text>
                      <Text type="secondary">{cred.password}</Text>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 24, color: '#8c8c8c', fontSize: 12 }}>
          © 2026 CRM + HR System • Mock Data Only
        </div>
      </Card>
    </div>
  );
};
