import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Input,
  Select,
  Button,
  Tag,
  Space,
  Card,
  Row,
  Col,
  Statistic,
  Badge,
  Tooltip,
  Avatar,
  Modal,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
  SwapOutlined,
  EyeOutlined,
  TrophyOutlined,
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { mockCustomers, mockUsers } from '../../data/mockAuthData';
import { Customer } from '../../types/crm.types';
import { PermissionGuard } from '../../components/guards/PermissionGuard';

const { Search } = Input;

export const CustomerList: React.FC = () => {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Filter customers based on role
  const visibleCustomers = useMemo(() => {
    let filtered = customers;

    // Role-based filtering
    if (hasPermission('crm:view_all_customers')) {
      filtered = customers;
    } else if (hasPermission('crm:view_own_customers')) {
      filtered = customers.filter((c) => c.assignedTo === user?.id);
    } else {
      filtered = [];
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter((c) => c.priority === priorityFilter);
    }

    return filtered;
  }, [customers, user, searchTerm, statusFilter, priorityFilter, hasPermission]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: visibleCustomers.length,
      vip: visibleCustomers.filter((c) => c.priority === 'vip').length,
      customer: visibleCustomers.filter((c) => c.status === 'customer').length,
      totalValue: visibleCustomers.reduce((sum, c) => sum + c.totalValue, 0),
    };
  }, [visibleCustomers]);

  const handleTransfer = (customer: Customer) => {
    const targetUser = mockUsers.find((u) => u.role === 'sale' && u.id !== customer.assignedTo);
    if (targetUser) {
      Modal.confirm({
        title: 'Xác nhận chuyển khách hàng',
        content: `Bạn có chắc chắn muốn chuyển khách hàng "${customer.name}" cho ${targetUser.fullName}?`,
        okText: 'Chuyển',
        cancelText: 'Hủy',
        onOk: () => {
          const updatedCustomers = customers.map((c) =>
            c.id === customer.id
              ? { ...c, assignedTo: targetUser.id, assignedToName: targetUser.fullName }
              : c
          );
          setCustomers(updatedCustomers);
          message.success(`Đã chuyển khách hàng "${customer.name}" cho ${targetUser.fullName}`);
        },
      });
    }
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      lead: 'blue',
      prospect: 'cyan',
      customer: 'green',
      inactive: 'default',
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

  const getPriorityIcon = (priority: string) => {
    if (priority === 'vip') return <TrophyOutlined />;
    return null;
  };

  // Table columns
  const columns: ColumnsType<Customer> = [
    {
      title: 'Mã KH',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (code: string) => <strong>{code}</strong>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (name: string, record: Customer) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            {record.company && <div style={{ fontSize: 12, color: '#888' }}>{record.company}</div>}
          </div>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)} icon={getPriorityIcon(priority)}>
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Phụ trách',
      dataIndex: 'assignedToName',
      key: 'assignedToName',
      width: 150,
      render: (name: string) => (
        <Space>
          <TeamOutlined />
          {name}
        </Space>
      ),
    },
    {
      title: 'Giá trị',
      dataIndex: 'totalValue',
      key: 'totalValue',
      width: 130,
      align: 'right',
      render: (value: number) => (
        <strong style={{ color: '#52c41a' }}>
          {value.toLocaleString('vi-VN')} đ
        </strong>
      ),
      sorter: (a, b) => a.totalValue - b.totalValue,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record: Customer) => (
        <Space size="small">
          <PermissionGuard requiredPermissions={['crm:view_customer_history']}>
            <Tooltip title="Xem chi tiết">
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/crm/customers/${record.id}`)}
              >
                Chi tiết
              </Button>
            </Tooltip>
          </PermissionGuard>
          <PermissionGuard requiredPermissions={['crm:transfer_customer']}>
            <Tooltip title="Chuyển khách hàng">
              <Button
                type="link"
                icon={<SwapOutlined />}
                onClick={() => handleTransfer(record)}
              >
                Chuyển
              </Button>
            </Tooltip>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng khách hàng"
              value={stats.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Khách hàng VIP"
              value={stats.vip}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang giao dịch"
              value={stats.customer}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng giá trị"
              value={stats.totalValue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#faad14' }}
              formatter={(value) => `${Number(value).toLocaleString('vi-VN')} đ`}
            />
          </Card>
        </Col>
      </Row>

      {/* Filter Card */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={8}>
            <Search
              placeholder="Tìm theo tên, email, mã KH..."
              allowClear
              enterButton={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={setSearchTerm}
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              style={{ width: '100%' }}
              placeholder="Trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: 'Tất cả trạng thái', value: 'all' },
                { label: '🔵 Lead', value: 'lead' },
                { label: '🔷 Prospect', value: 'prospect' },
                { label: '🟢 Customer', value: 'customer' },
                { label: '⚪ Inactive', value: 'inactive' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              style={{ width: '100%' }}
              placeholder="Ưu tiên"
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={[
                { label: 'Tất cả mức độ', value: 'all' },
                { label: '👑 VIP', value: 'vip' },
                { label: '🔴 High', value: 'high' },
                { label: '🟠 Medium', value: 'medium' },
                { label: '⚪ Low', value: 'low' },
              ]}
            />
          </Col>
          <Col xs={24} sm={24} md={6}>
            <PermissionGuard requiredPermissions={['crm:create_customer']}>
              <Button type="primary" icon={<PlusOutlined />} block>
                Tạo khách hàng mới
              </Button>
            </PermissionGuard>
          </Col>
        </Row>
      </Card>

      {/* Customer Table */}
      <Card
        title={
          <Space>
            <TeamOutlined />
            <span>Danh sách khách hàng</span>
            <Badge count={visibleCustomers.length} showZero style={{ backgroundColor: '#1677ff' }} />
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={visibleCustomers}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} khách hàng`,
          }}
          scroll={{ x: 1200 }}
          locale={{
            emptyText: (
              <div style={{ padding: '40px 0' }}>
                <p style={{ fontSize: 16, marginBottom: 8 }}>Không có khách hàng nào</p>
                {!hasPermission('crm:view_own_customers') && !hasPermission('crm:view_all_customers') && (
                  <p style={{ color: '#ff4d4f' }}>⚠️ Bạn không có quyền xem danh sách khách hàng</p>
                )}
              </div>
            ),
          }}
        />
      </Card>
    </div>
  );
};
