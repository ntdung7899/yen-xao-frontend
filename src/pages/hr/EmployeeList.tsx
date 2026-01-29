import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Avatar,
  Modal,
  message,
  Card,
  Row,
  Col,
  Tooltip,
  Form,
  DatePicker,
  Radio,
  InputNumber
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  UserOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { Employee } from "@/types/hr.types";
import {
  mockEmployees,
  mockDepartments,
  mockPositions,
  getDepartmentById,
  getPositionById,
} from "@/data/mockData";
import { mockUsers } from "@/data/mockAuthData";
import { useAuth } from "@/contexts/AuthContext";
import {
  formatCurrency,
  formatDate,
  formatPhone,
  getStatusColor,
  getStatusText,
} from "@/utils/formatters";
import {
  STATUS_OPTIONS,
  GENDER_OPTIONS,
  PAGE_SIZE_OPTIONS,
  DEFAULT_PAGE_SIZE,
} from "@/constants/hr.constants";
import dayjs from "dayjs";

const { Search } = Input;
const { Option } = Select;

interface EmployeeFormValues {
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  gender: "male" | "female" | "other";
  dateOfBirth: any;
  joinDate: any;
  departmentId: string;
  positionId: string;
  baseSalary: number;
  status: "active" | "inactive" | "resigned";
  address?: string;
  avatar?: string;
}

const EmployeeList = () => {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    showSizeChanger: true,
    showTotal: (total) => `Tổng số ${total} nhân viên`,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form] = Form.useForm();

  // Data
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    if (hasPermission("hr:view_all_employees")) {
      setEmployees(mockEmployees);
    } else if (hasPermission("hr:view_team_employees")) {
      const currentUser = mockUsers.find(u => u.id === user?.id);
      if (currentUser?.teamId) {
        const teamMemberIds = mockUsers
          .filter(u => u.teamId === currentUser.teamId)
          .map(u => u.id);

        setEmployees(mockEmployees.filter(e => teamMemberIds.includes(e.id)));
      } else {
        setEmployees([]);
      }
    } else if (hasPermission("hr:view_department_employees")) {
      setEmployees(mockEmployees.filter(e => e.departmentId === user?.departmentId));
    } else {
      setEmployees([]); // Or handle no permission more gracefully
    }
  }, [user, hasPermission]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Search filter
      const searchLower = searchText.toLowerCase();
      const matchSearch =
        !searchText ||
        emp.fullName.toLowerCase().includes(searchLower) ||
        emp.employeeCode.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.phone.includes(searchText);

      // Department filter
      const matchDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(emp.departmentId);
      const matchPosition = selectedPositions.length === 0 || selectedPositions.includes(emp.positionId);
      const matchStatus = selectedStatus.length === 0 || selectedStatus.includes(emp.status);
      const matchGender = selectedGender.length === 0 || selectedGender.includes(emp.gender);

      return matchSearch && matchDepartment && matchPosition && matchStatus && matchGender;
    });
  }, [employees, searchText, selectedDepartments, selectedPositions, selectedStatus, selectedGender]);

  // CRUD Handlers
  const handleAdd = () => {
    setEditingEmployee(null);
    form.resetFields();
    // Set default values
    form.setFieldsValue({
      status: 'active',
      gender: 'male',
      joinDate: dayjs(),
    });
    setIsModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue({
      ...employee,
      dateOfBirth: employee.dateOfBirth ? dayjs(employee.dateOfBirth) : null,
      joinDate: employee.joinDate ? dayjs(employee.joinDate) : null,
      resignDate: employee.resignDate ? dayjs(employee.resignDate) : null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc muốn xóa nhân viên ${employee.fullName}? Hành động này không thể hoàn tác.`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        setEmployees(employees.filter((emp) => emp.id !== employee.id));
        message.success("Xóa nhân viên thành công");
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values: EmployeeFormValues) => {
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
        joinDate: values.joinDate?.format('YYYY-MM-DD'),
      };

      if (editingEmployee) {
        // Update
        const updatedEmployees = employees.map(emp =>
          emp.id === editingEmployee.id ? { ...emp, ...formattedValues } : emp
        );
        setEmployees(updatedEmployees);
        message.success("Cập nhật thông tin nhân viên thành công");
      } else {
        // Create
        const newEmployee: Employee = {
          id: `emp-${Date.now()}`,
          ...formattedValues,
        } as Employee;
        setEmployees([...employees, newEmployee]);
        message.success("Thêm nhân viên mới thành công");
      }
      setIsModalOpen(false);
    });
  };

  // Other Handlers
  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleClearFilters = () => {
    setSearchText("");
    setSelectedDepartments([]);
    setSelectedPositions([]);
    setSelectedStatus([]);
    setSelectedGender([]);
    setPagination({ ...pagination, current: 1 });
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  const handleExport = () => {
    message.info("Tính năng xuất Excel đang được phát triển");
  };

  // Table columns
  const columns: ColumnsType<Employee> = [
    {
      title: "Mã NV",
      dataIndex: "employeeCode",
      key: "employeeCode",
      width: 100,
      fixed: "left",
      sorter: (a, b) => a.employeeCode.localeCompare(b.employeeCode),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
      fixed: "left",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      render: (text: string) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: "#1677ff" }} icon={<UserOutlined />}>
            {text.charAt(0)}
          </Avatar>
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 130,
      render: (phone: string) => formatPhone(phone),
    },
    {
      title: "Phòng ban",
      dataIndex: "departmentId",
      key: "departmentId",
      width: 180,
      render: (departmentId: string) => {
        const dept = getDepartmentById(departmentId);
        return dept?.name || "-";
      },
    },
    {
      title: "Chức vụ",
      dataIndex: "positionId",
      key: "positionId",
      width: 150,
      render: (positionId: string) => {
        const pos = getPositionById(positionId);
        return pos?.name || "-";
      },
    },
    {
      title: "Lương cơ bản",
      dataIndex: "baseSalary",
      key: "baseSalary",
      width: 150,
      align: "right",
      sorter: (a, b) => a.baseSalary - b.baseSalary,
      render: (salary: number) => formatCurrency(salary),
    },
    {
      title: "Ngày vào làm",
      dataIndex: "joinDate",
      key: "joinDate",
      width: 120,
      sorter: (a, b) => new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime(),
      render: (date: string) => formatDate(date),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status: "active" | "inactive" | "resigned") => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      fixed: "right",
      render: (_, record: Employee) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/hr/employees/${record.id}`)}
            />
          </Tooltip>
          {hasPermission("hr:edit_employee") && (
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
          )}
          {hasPermission("hr:delete_employee") && (
            <Tooltip title="Xóa">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: 24 }}>Quản lý nhân viên</h2>
        <Space>
          <Button type="default" icon={<ExportOutlined />} onClick={handleExport}>
            Xuất Excel
          </Button>
          {hasPermission("hr:create_employee") && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm nhân viên
            </Button>
          )}
        </Space>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Search
              placeholder="Tìm theo tên, mã NV, email, SĐT..."
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              onChange={(e) => !e.target.value && handleSearch("")}
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Select
              mode="multiple"
              placeholder="Phòng ban"
              style={{ width: "100%" }}
              value={selectedDepartments}
              onChange={setSelectedDepartments}
              options={mockDepartments.map((dept) => ({ label: dept.name, value: dept.id }))}
              maxTagCount="responsive"
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Select
              mode="multiple"
              placeholder="Chức vụ"
              style={{ width: "100%" }}
              value={selectedPositions}
              onChange={setSelectedPositions}
              options={mockPositions.map((pos) => ({ label: pos.name, value: pos.id }))}
              maxTagCount="responsive"
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Select
              mode="multiple"
              placeholder="Trạng thái"
              style={{ width: "100%" }}
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={STATUS_OPTIONS}
              maxTagCount="responsive"
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={2}>
            <Button block icon={<FilterOutlined />} onClick={handleClearFilters}>
              Xóa bộ lọc
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredEmployees}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 1500 }}
        size="middle"
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingEmployee ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="employeeCode"
                label="Mã nhân viên"
                rules={[{ required: true, message: "Vui lòng nhập mã nhân viên" }]}
              >
                <Input placeholder="EMP001" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: 'email', message: "Email không hợp lệ" }]}
              >
                <Input placeholder="example@company.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
              >
                <Input placeholder="0901234567" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateOfBirth"
                label="Ngày sinh"
                rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày sinh" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
              >
                <Select placeholder="Chọn giới tính">
                  {GENDER_OPTIONS.map(opt => (
                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="departmentId"
                label="Phòng ban"
                rules={[{ required: true, message: "Vui lòng chọn phòng ban" }]}
              >
                <Select placeholder="Chọn phòng ban">
                  {mockDepartments.map(d => (
                    <Option key={d.id} value={d.id}>{d.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="positionId"
                label="Chức vụ"
                rules={[{ required: true, message: "Vui lòng chọn chức vụ" }]}
              >
                <Select placeholder="Chọn chức vụ">
                  {mockPositions.map(p => (
                    <Option key={p.id} value={p.id}>{p.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="baseSalary"
                label="Lương cơ bản"
                rules={[{ required: true, message: "Vui lòng nhập lương cơ bản" }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="joinDate"
                label="Ngày vào làm"
                rules={[{ required: true, message: "Vui lòng chọn ngày vào làm" }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Trạng thái"
          >
            <Radio.Group>
              {STATUS_OPTIONS.map(opt => (
                <Radio key={opt.value} value={opt.value}>{opt.label}</Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
          >
            <Input.TextArea rows={2} placeholder="Nhập địa chỉ liên hệ" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeList;
