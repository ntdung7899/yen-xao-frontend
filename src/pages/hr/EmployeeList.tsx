import { useState, useMemo } from "react";
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

const { Search } = Input;

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
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
      const matchDepartment =
        selectedDepartments.length === 0 ||
        selectedDepartments.includes(emp.departmentId);

      // Position filter
      const matchPosition =
        selectedPositions.length === 0 ||
        selectedPositions.includes(emp.positionId);

      // Status filter
      const matchStatus =
        selectedStatus.length === 0 || selectedStatus.includes(emp.status);

      // Gender filter
      const matchGender =
        selectedGender.length === 0 || selectedGender.includes(emp.gender);

      return (
        matchSearch &&
        matchDepartment &&
        matchPosition &&
        matchStatus &&
        matchGender
      );
    });
  }, [
    employees,
    searchText,
    selectedDepartments,
    selectedPositions,
    selectedStatus,
    selectedGender,
  ]);

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
          <Avatar
            size="small"
            style={{ backgroundColor: "#1677ff" }}
            icon={<UserOutlined />}
          >
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
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Handlers
  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleEdit = (employee: Employee) => {
    // TODO: Open edit modal
    message.info(`Chỉnh sửa nhân viên: ${employee.fullName}`);
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

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: 24 }}>Quản lý nhân viên</h2>
        <Space>
          <Button
            type="default"
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
            Xuất Excel
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/hr/employees/new")}
          >
            Thêm nhân viên
          </Button>
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
              options={mockDepartments.map((dept) => ({
                label: dept.name,
                value: dept.id,
              }))}
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
              options={mockPositions.map((pos) => ({
                label: pos.name,
                value: pos.id,
              }))}
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
          <Col xs={24} sm={12} md={6} lg={4}>
            <Select
              mode="multiple"
              placeholder="Giới tính"
              style={{ width: "100%" }}
              value={selectedGender}
              onChange={setSelectedGender}
              options={GENDER_OPTIONS}
              maxTagCount="responsive"
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={2}>
            <Button
              block
              icon={<FilterOutlined />}
              onClick={handleClearFilters}
            >
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
    </div>
  );
};

export default EmployeeList;
