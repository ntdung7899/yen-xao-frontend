import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Row, Col, Descriptions, Tag, Button, Space, Timeline, Statistic, Avatar, Empty,
  List, Upload, message, Tooltip
} from 'antd';
import {
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
  TrophyOutlined,
  UploadOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';
import { mockCustomers, mockCustomerHistory } from '../../data/mockAuthData';
import { PermissionGuard } from '../../components/guards/PermissionGuard';
import { Quotation } from '@/types/crm.types';
import { useAuth } from '@/contexts/AuthContext';
import { RcFile } from 'antd/es/upload';

export const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer] = useState(() => mockCustomers.find((c) => c.id === id));
  const [history] = useState(() => mockCustomerHistory.filter((h) => h.customerId === id));

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      lead: 'default',
      prospect: 'processing',
      customer: 'success',
      inactive: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string): string => {
    const texts: Record<string, string> = {
      lead: 'Lead',
      prospect: 'Prospect',
      customer: 'Customer',
      inactive: 'Inactive',
    };
    return texts[status] || status;
  };

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      vip: 'purple',
      high: 'red',
      medium: 'orange',
      low: 'default',
    };
    return colors[priority] || 'default';
  };

  const getActionColor = (action: string): string => {
    const colors: Record<string, string> = {
      create: 'blue',
      update: 'orange',
      contact: 'green',
      note: 'cyan',
      transfer: 'purple',
    };
    return colors[action] || 'default';
  };

  const { user } = useAuth();
  const [quotations, setQuotations] = useState<Quotation[]>(customer?.quotations || []);

  const handleUpload = (file: RcFile) => {
    const isAllowedType =
      file.type === 'application/pdf' ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    if (!isAllowedType) {
      message.error('Chỉ được phép tải lên file PDF, Word hoặc Excel!');
      return Upload.LIST_IGNORE;
    }

    // Simulate upload
    const type = file.type.includes('pdf') ? 'pdf' :
      file.type.includes('excel') || file.type.includes('spreadsheet') ? 'excel' : 'word';

    const newQuotation: Quotation = {
      id: `quote-${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file), // Mock URL
      type: type as any,
      uploadDate: new Date().toISOString(),
      size: file.size,
      uploadedBy: user?.id || 'unknown',
      uploadedByName: user?.fullName || 'Unknown',
    };

    setTimeout(() => {
      setQuotations(prev => [newQuotation, ...prev]);
      message.success(`${file.name} đã được tải lên thành công`);
    }, 1000);

    return false; // Prevent auto upload
  };

  const handleDeleteQuotation = (id: string) => {
    setQuotations(prev => prev.filter(q => q.id !== id));
    message.success('Đã xóa báo giá');
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FilePdfOutlined style={{ color: 'red' }} />;
      case 'word': return <FileWordOutlined style={{ color: 'blue' }} />;
      case 'excel': return <FileExcelOutlined style={{ color: 'green' }} />;
      default: return <PaperClipOutlined />;
    }
  };

  if (!customer) {
    return (
      <div style={{ padding: 24 }}>
        <Empty
          description="Không tìm thấy khách hàng"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => navigate('/crm/customers')}>
            Về danh sách
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/crm/customers')}
          style={{ marginBottom: 16 }}
        >
          Quay lại
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar size={64} style={{ backgroundColor: '#1890ff' }}>
            {customer.name.charAt(0)}
          </Avatar>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
              {customer.name}
              {customer.priority === 'vip' && (
                <TrophyOutlined style={{ marginLeft: 12, color: '#722ed1' }} />
              )}
            </h1>
            <p style={{ color: '#8c8c8c', margin: '4px 0 0 0' }}>{customer.code}</p>
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Main Info */}
        <Col xs={24} lg={16}>
          {/* Main Info Card */}
          <Card title="Thông tin cơ bản" bordered={false}>
            {/* ... (existing descriptions) ... */}
            <Descriptions column={{ xs: 1, sm: 2 }} bordered>
              <Descriptions.Item label="Tên khách hàng" span={2}>
                <strong>{customer.name}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>
                <a href={`mailto:${customer.email}`}>{customer.email}</a>
              </Descriptions.Item>
              <Descriptions.Item label="Điện thoại">
                <a href={`tel:${customer.phone}`}>{customer.phone}</a>
              </Descriptions.Item>
              <Descriptions.Item label="Công ty">
                {customer.company || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(customer.status)}>
                  {getStatusText(customer.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ưu tiên">
                <Tag color={getPriorityColor(customer.priority)}>
                  {customer.priority.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Người phụ trách" span={2}>
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  {customer.assignedToName}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng giá trị" span={2}>
                <strong style={{ fontSize: 18, color: '#52c41a' }}>
                  {customer.totalValue.toLocaleString('vi-VN')} đ
                </strong>
              </Descriptions.Item>
            </Descriptions>

            {customer.notes && (
              <div style={{ marginTop: 24 }}>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>Ghi chú:</div>
                <div style={{ background: '#fafafa', padding: 12, borderRadius: 4, border: '1px solid #d9d9d9' }}>
                  {customer.notes}
                </div>
              </div>
            )}

            {customer.tags.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>Tags:</div>
                <Space wrap>
                  {customer.tags.map((tag) => (
                    <Tag key={tag} color="blue">{tag}</Tag>
                  ))}
                </Space>
              </div>
            )}

            <PermissionGuard requiredPermissions={['crm:edit_customer']}>
              <div style={{ marginTop: 24 }}>
                <Space>
                  <Button type="primary" icon={<EditOutlined />}>
                    Chỉnh sửa
                  </Button>
                  <Button icon={<MailOutlined />}>
                    Gửi email
                  </Button>
                  <Button icon={<PhoneOutlined />}>
                    Gọi điện
                  </Button>
                </Space>
              </div>
            </PermissionGuard>
          </Card>

          {/* Quotations Section */}
          <Card
            title="Báo giá"
            bordered={false}
            style={{ marginTop: 24 }}
            extra={
              <Upload
                beforeUpload={handleUpload}
                showUploadList={false}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
              >
                <Button icon={<UploadOutlined />}>Tải báo giá</Button>
              </Upload>
            }
          >
            {quotations.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={quotations}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteQuotation(item.id)}
                      />
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={getFileIcon(item.type)} style={{ backgroundColor: 'transparent', color: '#000' }} />}
                      title={<a href={item.url} target="_blank" rel="noreferrer">{item.name}</a>}
                      description={
                        <Space>
                          <span>{(item.size / 1024).toFixed(1)} KB</span>
                          <span>•</span>
                          <span>{new Date(item.uploadDate).toLocaleDateString('vi-VN')}</span>
                          <span>•</span>
                          <span>Bởi: {item.uploadedByName || item.uploadedBy}</span>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="Chưa có báo giá nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>

          {/* History */}
          <PermissionGuard requiredPermissions={['crm:view_customer_history']}>
            <Card title="📜 Lịch sử hoạt động" bordered={false} style={{ marginTop: 24 }}>
              {history.length > 0 ? (
                <Timeline
                  items={history.map((h) => ({
                    children: (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                          <strong style={{ fontSize: 14 }}>{h.description}</strong>
                          <Tag color={getActionColor(h.action)}>{h.action.toUpperCase()}</Tag>
                        </div>
                        <div style={{ fontSize: 13, color: '#8c8c8c' }}>
                          Bởi: {h.performedByName} • {new Date(h.timestamp).toLocaleString('vi-VN')}
                        </div>
                      </div>
                    ),
                  }))}
                />
              ) : (
                <Empty description="Chưa có lịch sử hoạt động" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Card>
          </PermissionGuard>
        </Col>

        {/* Stats Sidebar */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card bordered={false}>
              <Statistic
                title="Tổng giao dịch"
                value={customer.totalValue}
                precision={0}
                suffix="đ"
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>

            <Card bordered={false}>
              <Statistic
                title="Lịch sử hoạt động"
                value={history.length}
                suffix="hoạt động"
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>

            <Card bordered={false}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 8 }}>Ngày tạo</div>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#722ed1' }}>
                  {new Date(customer.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </Card>

            <Card bordered={false}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 8 }}>Cập nhật lần cuối</div>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#fa8c16' }}>
                  {new Date(customer.updatedAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};
