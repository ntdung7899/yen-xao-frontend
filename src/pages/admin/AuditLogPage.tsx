import React, { useState, useMemo } from 'react';
import { Card, Table, Input, Select, Tag, Space, Avatar, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  LoginOutlined,
  LogoutOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SwapOutlined,
  ExportOutlined,
  StopOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { mockAuditLogs } from '../../data/mockAuthData';
import { AuditLog, AuditAction, AuditEntity } from '../../types/audit.types';

export const AuditLogPage: React.FC = () => {
  const [logs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [successFilter, setSuccessFilter] = useState<string>('all');

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        !searchTerm ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchAction = actionFilter === 'all' || log.action === actionFilter;
      const matchEntity = entityFilter === 'all' || log.entity === entityFilter;
      const matchSuccess =
        successFilter === 'all' ||
        (successFilter === 'success' && log.success) ||
        (successFilter === 'failed' && !log.success);

      return matchSearch && matchAction && matchEntity && matchSuccess;
    });
  }, [logs, searchTerm, actionFilter, entityFilter, successFilter]);

  const getActionIcon = (action: AuditAction) => {
    const icons: Record<AuditAction, React.ReactNode> = {
      login: <LoginOutlined />,
      logout: <LogoutOutlined />,
      create: <PlusOutlined />,
      update: <EditOutlined />,
      delete: <DeleteOutlined />,
      transfer: <SwapOutlined />,
      export: <ExportOutlined />,
      access_denied: <StopOutlined />,
    };
    return icons[action] || <EditOutlined />;
  };

  const getActionColor = (action: AuditAction): string => {
    const colors: Record<AuditAction, string> = {
      login: 'green',
      logout: 'default',
      create: 'blue',
      update: 'orange',
      delete: 'red',
      transfer: 'purple',
      export: 'cyan',
      access_denied: 'red',
    };
    return colors[action] || 'default';
  };

  const getEntityColor = (entity: AuditEntity): string => {
    const colors: Record<AuditEntity, string> = {
      customer: 'blue',
      employee: 'green',
      department: 'purple',
      user: 'orange',
      team: 'magenta',
      system: 'default',
    };
    return colors[entity] || 'default';
  };

  const columns: ColumnsType<AuditLog> = [
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp: string) => (
        <span style={{ fontSize: 13 }}>{new Date(timestamp).toLocaleString('vi-VN')}</span>
      ),
      sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'userName',
      key: 'userName',
      width: 180,
      render: (userName: string, record: AuditLog) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
            {userName.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{userName}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.userRole}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      width: 140,
      render: (action: AuditAction) => (
        <Tag icon={getActionIcon(action)} color={getActionColor(action)}>
          {action.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Đối tượng',
      dataIndex: 'entity',
      key: 'entity',
      width: 140,
      render: (entity: AuditEntity, record: AuditLog) => (
        <div>
          <Tag color={getEntityColor(entity)}>{entity.toUpperCase()}</Tag>
          {record.entityName && (
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>{record.entityName}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'success',
      key: 'success',
      width: 120,
      render: (success: boolean) =>
        success ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Thành công
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Thất bại
          </Tag>
        ),
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 140,
      render: (ip: string) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{ip}</span>,
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>📜 Audit Log</h1>
        <p style={{ fontSize: 16, color: '#8c8c8c' }}>Theo dõi toàn bộ hoạt động hệ thống</p>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Tìm kiếm</div>
            <Input
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mô tả, người thực hiện..."
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Hành động</div>
            <Select
              value={actionFilter}
              onChange={setActionFilter}
              style={{ width: '100%' }}
              options={[
                { label: 'Tất cả', value: 'all' },
                { label: 'Login', value: 'login' },
                { label: 'Logout', value: 'logout' },
                { label: 'Create', value: 'create' },
                { label: 'Update', value: 'update' },
                { label: 'Delete', value: 'delete' },
                { label: 'Transfer', value: 'transfer' },
                { label: 'Export', value: 'export' },
                { label: 'Access Denied', value: 'access_denied' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Đối tượng</div>
            <Select
              value={entityFilter}
              onChange={setEntityFilter}
              style={{ width: '100%' }}
              options={[
                { label: 'Tất cả', value: 'all' },
                { label: 'Customer', value: 'customer' },
                { label: 'Employee', value: 'employee' },
                { label: 'Department', value: 'department' },
                { label: 'User', value: 'user' },
                { label: 'Team', value: 'team' },
                { label: 'System', value: 'system' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Trạng thái</div>
            <Select
              value={successFilter}
              onChange={setSuccessFilter}
              style={{ width: '100%' }}
              options={[
                { label: 'Tất cả', value: 'all' },
                { label: 'Thành công', value: 'success' },
                { label: 'Thất bại', value: 'failed' },
              ]}
            />
          </Col>
        </Row>
        <div style={{ marginTop: 16, color: '#8c8c8c' }}>
          Hiển thị: <strong>{filteredLogs.length}</strong> / {logs.length} bản ghi
        </div>
      </Card>

      {/* Log Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredLogs}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} log`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>
    </div>
  );
};
