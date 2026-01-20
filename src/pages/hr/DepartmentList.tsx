import { useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Tag,
  Avatar,
  Space,
  Modal,
  Form,
  message,
  Tooltip,
  Empty,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Department, DepartmentFormData } from "@/types/hr.types";
import {
  mockDepartments,
  getEmployeeCountByDepartment,
  getEmployeeById,
  generateDepartmentId,
} from "@/data/mockData";
import { departmentSchema } from "@/utils/validators";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { truncateText } from "@/utils/formatters";

const { Search } = Input;
const { TextArea } = Input;

const DepartmentList = () => {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    resolver: yupResolver(departmentSchema),
  });

  // Filter departments
  const filteredDepartments = departments.filter((dept) => {
    const searchLower = searchText.toLowerCase();
    return (
      !searchText ||
      dept.name.toLowerCase().includes(searchLower) ||
      dept.code.toLowerCase().includes(searchLower)
    );
  });

  // Handlers
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleAdd = () => {
    reset({
      code: "",
      name: "",
      description: "",
      managerId: undefined,
    });
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (department: Department) => {
    reset({
      code: department.code,
      name: department.name,
      description: department.description,
      managerId: department.managerId,
    });
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  const handleDelete = (department: Department) => {
    const employeeCount = getEmployeeCountByDepartment(department.id);

    if (employeeCount > 0) {
      Modal.warning({
        title: "Không thể xóa",
        content: `Không thể xóa phòng ban đang có ${employeeCount} nhân viên. Vui lòng chuyển nhân viên sang phòng ban khác trước.`,
      });
      return;
    }

    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc muốn xóa phòng ban ${department.name}?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        setDepartments(departments.filter((d) => d.id !== department.id));
        message.success("Xóa phòng ban thành công");
      },
    });
  };

  const onSubmit = (data: DepartmentFormData) => {
    if (editingDepartment) {
      // Update
      setDepartments(
        departments.map((d) =>
          d.id === editingDepartment.id
            ? { ...d, ...data }
            : d
        )
      );
      message.success("Cập nhật phòng ban thành công");
    } else {
      // Create
      const newDepartment: Department = {
        id: generateDepartmentId(),
        ...data,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setDepartments([...departments, newDepartment]);
      message.success("Thêm phòng ban thành công");
    }
    setIsModalOpen(false);
    reset();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    reset();
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 24 }}>Quản lý phòng ban</h2>
        <Space>
          <Search
            placeholder="Tìm theo tên, mã..."
            allowClear
            style={{ width: 300 }}
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            onChange={(e) => !e.target.value && handleSearch("")}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm phòng ban
          </Button>
        </Space>
      </div>

      {/* Department Cards */}
      {filteredDepartments.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredDepartments.map((dept) => {
            const employeeCount = getEmployeeCountByDepartment(dept.id);
            const manager = dept.managerId ? getEmployeeById(dept.managerId) : null;

            return (
              <Col xs={24} sm={12} md={8} lg={6} key={dept.id}>
                <Card
                  hoverable
                  actions={[
                    <Tooltip title="Chỉnh sửa" key="edit">
                      <EditOutlined onClick={() => handleEdit(dept)} />
                    </Tooltip>,
                    <Tooltip title="Xóa" key="delete">
                      <DeleteOutlined onClick={() => handleDelete(dept)} />
                    </Tooltip>,
                  ]}
                >
                  <div style={{ marginBottom: 12 }}>
                    <Tag color="blue">{dept.code}</Tag>
                  </div>
                  <h3 style={{ marginBottom: 8, fontSize: 18 }}>{dept.name}</h3>
                  <p
                    style={{
                      color: "#666",
                      marginBottom: 16,
                      minHeight: 40,
                      fontSize: 14,
                    }}
                  >
                    {truncateText(dept.description, 60)}
                  </p>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <TeamOutlined style={{ color: "#1677ff" }} />
                      <span>
                        <strong>{employeeCount}</strong> nhân viên
                      </span>
                    </div>
                    {manager && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Avatar
                          size="small"
                          style={{ backgroundColor: "#52c41a" }}
                          icon={<UserOutlined />}
                        />
                        <span style={{ fontSize: 14 }}>{manager.fullName}</span>
                      </div>
                    )}
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <Card>
          <Empty description="Không tìm thấy phòng ban" />
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        title={editingDepartment ? "Chỉnh sửa phòng ban" : "Thêm phòng ban mới"}
        open={isModalOpen}
        onOk={handleSubmit(onSubmit)}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        <Form layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item
            label="Mã phòng ban"
            validateStatus={errors.code ? "error" : ""}
            help={errors.code?.message}
            required
          >
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Ví dụ: IT, HR, SALES"
                  disabled={!!editingDepartment}
                  style={{ textTransform: "uppercase" }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Tên phòng ban"
            validateStatus={errors.name ? "error" : ""}
            help={errors.name?.message}
            required
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Nhập tên phòng ban" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            validateStatus={errors.description ? "error" : ""}
            help={errors.description?.message}
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  rows={4}
                  placeholder="Nhập mô tả về phòng ban"
                />
              )}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DepartmentList;
