import { useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  InputNumber,
  message,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Position, PositionFormData } from "@/types/hr.types";
import {
  mockPositions,
  mockEmployees,
  generatePositionId,
} from "@/data/mockData";
import { positionSchema } from "@/utils/validators";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

const { Search } = Input;
const { TextArea } = Input;

const PositionList = () => {
  const [positions, setPositions] = useState<Position[]>(mockPositions);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PositionFormData>({
    resolver: yupResolver(positionSchema) as any,
  });

  // Filter positions
  const filteredPositions = positions.filter((pos) => {
    const searchLower = searchText.toLowerCase();
    return (
      !searchText ||
      pos.name.toLowerCase().includes(searchLower) ||
      pos.code.toLowerCase().includes(searchLower)
    );
  });

  // Get employee count by position
  const getEmployeeCountByPosition = (positionId: string): number => {
    return mockEmployees.filter(
      (emp) => emp.positionId === positionId && emp.status !== "resigned"
    ).length;
  };

  // Table columns
  const columns: ColumnsType<Position> = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 120,
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Tên chức vụ",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Cấp bậc",
      dataIndex: "level",
      key: "level",
      width: 100,
      align: "center",
      sorter: (a, b) => a.level - b.level,
      render: (level: number) => (
        <Tag color={level <= 2 ? "red" : level <= 4 ? "orange" : "green"}>
          Cấp {level}
        </Tag>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Số nhân viên",
      key: "employeeCount",
      width: 120,
      align: "center",
      render: (_, record) => {
        const count = getEmployeeCountByPosition(record.id);
        return <strong>{count}</strong>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  // Handlers
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleAdd = () => {
    reset({
      code: "",
      name: "",
      level: 5,
      description: "",
    });
    setEditingPosition(null);
    setIsModalOpen(true);
  };

  const handleEdit = (position: Position) => {
    reset({
      code: position.code,
      name: position.name,
      level: position.level,
      description: position.description,
    });
    setEditingPosition(position);
    setIsModalOpen(true);
  };

  const handleDelete = (position: Position) => {
    const employeeCount = getEmployeeCountByPosition(position.id);

    if (employeeCount > 0) {
      Modal.warning({
        title: "Không thể xóa",
        content: `Không thể xóa chức vụ đang có ${employeeCount} nhân viên. Vui lòng chuyển nhân viên sang chức vụ khác trước.`,
      });
      return;
    }

    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc muốn xóa chức vụ ${position.name}?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        setPositions(positions.filter((p) => p.id !== position.id));
        message.success("Xóa chức vụ thành công");
      },
    });
  };

  const onSubmit = (data: PositionFormData) => {
    if (editingPosition) {
      // Update
      setPositions(
        positions.map((p) =>
          p.id === editingPosition.id ? { ...p, ...data } : p
        )
      );
      message.success("Cập nhật chức vụ thành công");
    } else {
      // Create
      const newPosition: Position = {
        id: generatePositionId(),
        ...data,
      };
      setPositions([...positions, newPosition]);
      message.success("Thêm chức vụ thành công");
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
        <h2 style={{ margin: 0, fontSize: 24 }}>Quản lý chức vụ</h2>
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
            Thêm chức vụ
          </Button>
        </Space>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredPositions}
        rowKey="id"
        pagination={{ pageSize: 20, showSizeChanger: true }}
        size="middle"
      />

      {/* Add/Edit Modal */}
      <Modal
        title={editingPosition ? "Chỉnh sửa chức vụ" : "Thêm chức vụ mới"}
        open={isModalOpen}
        onOk={handleSubmit(onSubmit)}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        <Form layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item
            label="Mã chức vụ"
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
                  placeholder="Ví dụ: CEO, MGR, SR"
                  disabled={!!editingPosition}
                  style={{ textTransform: "uppercase" }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Tên chức vụ"
            validateStatus={errors.name ? "error" : ""}
            help={errors.name?.message}
            required
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Nhập tên chức vụ" />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Cấp bậc"
            validateStatus={errors.level ? "error" : ""}
            help={errors.level?.message}
            required
            extra="Cấp bậc từ 1 (cao nhất) đến 7 (thấp nhất)"
          >
            <Controller
              name="level"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={1}
                  max={7}
                  style={{ width: "100%" }}
                  placeholder="Nhập cấp bậc (1-7)"
                />
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
                  placeholder="Nhập mô tả về chức vụ"
                />
              )}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PositionList;
