import { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Statistic,
  Drawer,
  Form,
  InputNumber,
  DatePicker,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  DollarOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { SalaryRecord } from '../../types/salary.types';
import { mockSalaries } from '../../data/mockSalaryData';
import { mockDepartments, mockPositions } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

export default function SalariesPage() {
  const { user, hasPermission } = useAuth();
  const [salaries, setSalaries] = useState<SalaryRecord[]>(mockSalaries);
  const [searchText, setSearchText] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>();
  const [positionFilter, setPositionFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<SalaryRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  // Check permissions
  const canViewAll = hasPermission('hr:view_salary');
  const canViewOwn = hasPermission('hr:view_own_salary');
  const canEdit = hasPermission('hr:edit_salary');

  // Filter salaries based on role and permissions
  const filteredSalaries = useMemo(() => {
    let filtered = salaries;

    // Apply role-based filtering
    if (!canViewAll && canViewOwn && user) {
      // Sales can only view their own salary
      filtered = filtered.filter(s => s.employeeId === user.id);
    }

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(s =>
        s.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
        s.employeeCode.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply department filter
    if (departmentFilter) {
      filtered = filtered.filter(s => s.departmentId === departmentFilter);
    }

    // Apply position filter
    if (positionFilter) {
      filtered = filtered.filter(s => s.positionId === positionFilter);
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    return filtered;
  }, [salaries, searchText, departmentFilter, positionFilter, statusFilter, canViewAll, canViewOwn, user]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredSalaries.length;
    const avgGross = filteredSalaries.reduce((sum, s) => sum + s.grossSalary, 0) / (total || 1);
    const avgNet = filteredSalaries.reduce((sum, s) => sum + s.netSalary, 0) / (total || 1);
    const totalPayroll = filteredSalaries.reduce((sum, s) => sum + s.netSalary, 0);

    return { total, avgGross, avgNet, totalPayroll };
  }, [filteredSalaries]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Table columns
  const columns: ColumnsType<SalaryRecord> = [
    {
      title: 'Mã NV',
      dataIndex: 'employeeCode',
      key: 'employeeCode',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: 180,
      fixed: 'left',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 150,
    },
    {
      title: 'Chức vụ',
      dataIndex: 'positionName',
      key: 'positionName',
      width: 150,
    },
    {
      title: 'Lương cơ bản',
      dataIndex: 'baseSalary',
      key: 'baseSalary',
      width: 150,
      align: 'right',
      render: (value) => <Text strong>{formatCurrency(value)}</Text>,
    },
    {
      title: 'Phụ cấp',
      dataIndex: 'totalAllowances',
      key: 'totalAllowances',
      width: 130,
      align: 'right',
      render: (value) => <Text type="success">{formatCurrency(value)}</Text>,
    },
    {
      title: 'Thưởng',
      dataIndex: 'totalBonuses',
      key: 'totalBonuses',
      width: 130,
      align: 'right',
      render: (value) => <Text type="warning">{formatCurrency(value)}</Text>,
    },
    {
      title: 'Tổng lương',
      dataIndex: 'grossSalary',
      key: 'grossSalary',
      width: 150,
      align: 'right',
      render: (value) => <Text strong style={{ color: '#1890ff' }}>{formatCurrency(value)}</Text>,
    },
    {
      title: 'Thực lĩnh',
      dataIndex: 'netSalary',
      key: 'netSalary',
      width: 150,
      align: 'right',
      render: (value) => <Text strong style={{ color: '#52c41a', fontSize: 15 }}>{formatCurrency(value)}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status) => {
        const colorMap = {
          active: 'success',
          pending: 'warning',
          archived: 'default',
        };
        const labelMap = {
          active: 'Đang áp dụng',
          pending: 'Chờ duyệt',
          archived: 'Lưu trữ',
        };
        return <Tag color={colorMap[status as keyof typeof colorMap]}>{labelMap[status as keyof typeof labelMap]}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            Xem
          </Button>
          {canEdit && (
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              Sửa
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleView = (record: SalaryRecord) => {
    setSelectedSalary(record);
    setIsEditing(false);
    setDrawerVisible(true);
    form.setFieldsValue({
      ...record,
      effectiveDate: dayjs(record.effectiveDate),
    });
  };

  const handleEdit = (record: SalaryRecord) => {
    setSelectedSalary(record);
    setIsEditing(true);
    setDrawerVisible(true);
    form.setFieldsValue({
      ...record,
      effectiveDate: dayjs(record.effectiveDate),
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      // Calculate totals
      const totalAllowances = Object.values(values.allowances || {}).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
      const totalBonuses = Object.values(values.bonuses || {}).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
      const totalDeductions = Object.values(values.deductions || {}).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
      const grossSalary = values.baseSalary + totalAllowances + totalBonuses;
      const netSalary = grossSalary - totalDeductions;

      const updatedSalary: SalaryRecord = {
        ...selectedSalary!,
        ...values,
        totalAllowances,
        totalBonuses,
        totalDeductions,
        grossSalary,
        netSalary,
        effectiveDate: values.effectiveDate.format('YYYY-MM-DD'),
        lastUpdated: dayjs().format('YYYY-MM-DD'),
        updatedBy: user?.fullName || 'Unknown',
      };

      setSalaries(prev => prev.map(s => s.id === updatedSalary.id ? updatedSalary : s));
      message.success('Cập nhật lương thành công');
      setDrawerVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <div style={{ padding: '0 24px' }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        <DollarOutlined /> Quản lý lương
      </Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Tổng nhân viên</span>}
              value={stats.total}
              suffix="người"
              valueStyle={{ color: 'white' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Lương TB (Gross)</span>}
              value={stats.avgGross / 1000000}
              suffix="Tr"
              precision={1}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Lương TB (Net)</span>}
              value={stats.avgNet / 1000000}
              suffix="Tr"
              precision={1}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Tổng quỹ lương</span>}
              value={stats.totalPayroll / 1000000000}
              suffix="Tỷ"
              precision={2}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm kiếm tên, mã NV..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Phòng ban"
              value={departmentFilter}
              onChange={setDepartmentFilter}
              allowClear
              style={{ width: '100%' }}
            >
              {mockDepartments.map(dept => (
                <Option key={dept.id} value={dept.id}>{dept.name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Chức vụ"
              value={positionFilter}
              onChange={setPositionFilter}
              allowClear
              style={{ width: '100%' }}
            >
              {mockPositions.map(pos => (
                <Option key={pos.id} value={pos.id}>{pos.name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="active">Đang áp dụng</Option>
              <Option value="pending">Chờ duyệt</Option>
              <Option value="archived">Lưu trữ</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Salary Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredSalaries}
          rowKey="id"
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} bản ghi`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      {/* Detail/Edit Drawer */}
      <Drawer
        title={isEditing ? 'Chỉnh sửa lương' : 'Chi tiết lương'}
        width={720}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
        }}
        extra={
          isEditing && (
            <Space>
              <Button onClick={() => setDrawerVisible(false)}>Hủy</Button>
              <Button type="primary" onClick={handleSave}>
                Lưu
              </Button>
            </Space>
          )
        }
      >
        {selectedSalary && (
          <Form form={form} layout="vertical">
            <Card size="small" style={{ marginBottom: 16, background: '#f0f2f5' }}>
              <Title level={5}>Thông tin nhân viên</Title>
              <Text><strong>Mã NV:</strong> {selectedSalary.employeeCode}</Text><br />
              <Text><strong>Tên:</strong> {selectedSalary.employeeName}</Text><br />
              <Text><strong>Phòng ban:</strong> {selectedSalary.departmentName}</Text><br />
              <Text><strong>Chức vụ:</strong> {selectedSalary.positionName}</Text>
            </Card>

            <Title level={5}>Lương cơ bản</Title>
            <Form.Item name="baseSalary" label="Lương cơ bản" rules={[{ required: true }]}>
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                addonAfter="VNĐ"
                disabled={!isEditing}
              />
            </Form.Item>

            <Title level={5}>Phụ cấp</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name={['allowances', 'housing']} label="Nhà ở">
                  <InputNumber style={{ width: '100%' }} addonAfter="VNĐ" disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={['allowances', 'transport']} label="Đi lại">
                  <InputNumber style={{ width: '100%' }} addonAfter="VNĐ" disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={['allowances', 'meal']} label="Ăn uống">
                  <InputNumber style={{ width: '100%' }} addonAfter="VNĐ" disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={['allowances', 'phone']} label="Điện thoại">
                  <InputNumber style={{ width: '100%' }} addonAfter="VNĐ" disabled={!isEditing} />
                </Form.Item>
              </Col>
            </Row>

            <Title level={5}>Thưởng</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name={['bonuses', 'performance']} label="Hiệu suất">
                  <InputNumber style={{ width: '100%' }} addonAfter="VNĐ" disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={['bonuses', 'project']} label="Dự án">
                  <InputNumber style={{ width: '100%' }} addonAfter="VNĐ" disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={['bonuses', 'holiday']} label="Lễ tết">
                  <InputNumber style={{ width: '100%' }} addonAfter="VNĐ" disabled={!isEditing} />
                </Form.Item>
              </Col>
            </Row>

            <Title level={5}>Khấu trừ</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name={['deductions', 'insurance']} label="Bảo hiểm">
                  <InputNumber style={{ width: '100%' }} addonAfter="VNĐ" disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={['deductions', 'tax']} label="Thuế">
                  <InputNumber style={{ width: '100%' }} addonAfter="VNĐ" disabled={!isEditing} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="effectiveDate" label="Ngày hiệu lực">
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" disabled={!isEditing} />
            </Form.Item>

            <Form.Item name="notes" label="Ghi chú">
              <Input.TextArea rows={3} disabled={!isEditing} />
            </Form.Item>

            {!isEditing && (
              <Card size="small" style={{ background: '#e6f7ff', marginTop: 16 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>Tổng lương (Gross):</Text>
                    <div style={{ fontSize: 18, color: '#1890ff', fontWeight: 'bold' }}>
                      {formatCurrency(selectedSalary.grossSalary)}
                    </div>
                  </Col>
                  <Col span={12}>
                    <Text strong>Thực lĩnh (Net):</Text>
                    <div style={{ fontSize: 18, color: '#52c41a', fontWeight: 'bold' }}>
                      {formatCurrency(selectedSalary.netSalary)}
                    </div>
                  </Col>
                </Row>
              </Card>
            )}
          </Form>
        )}
      </Drawer>
    </div>
  );
}
