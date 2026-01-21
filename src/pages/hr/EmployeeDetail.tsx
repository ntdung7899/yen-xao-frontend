import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Avatar,
  Tag,
  Button,
  Space,
  Descriptions,
  Tabs,
  Timeline,
  Empty,
  Modal,
  message,
  Row,
  Col,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Employee } from "@/types/hr.types";
import {
  getEmployeeById,
  getDepartmentById,
  getPositionById,
  getWorkHistoryByEmployee,
} from "@/data/mockData";
import {
  formatCurrency,
  formatDate,
  formatDateLong,
  formatPhone,
  calculateAge,
  getStatusColor,
  getStatusText,
  getGenderText,
} from "@/utils/formatters";
import { AVATAR_SIZE } from "@/constants/hr.constants";

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Simulate API call
      setTimeout(() => {
        const emp = getEmployeeById(id);
        setEmployee(emp || null);
        setLoading(false);
      }, 300);
    }
  }, [id]);

  const handleEdit = () => {
    message.info("Chức năng chỉnh sửa đang được phát triển");
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc muốn xóa nhân viên ${employee?.fullName}? Hành động này không thể hoàn tác.`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        message.success("Xóa nhân viên thành công");
        navigate("/hr/employees");
      },
    });
  };

  if (loading) {
    return <Card loading={loading} />;
  }

  if (!employee) {
    return (
      <Card>
        <Empty description="Không tìm thấy nhân viên" />
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Button type="primary" onClick={() => navigate("/hr/employees")}>
            Quay lại danh sách
          </Button>
        </div>
      </Card>
    );
  }

  const department = getDepartmentById(employee.departmentId);
  const position = getPositionById(employee.positionId);
  const workHistory = getWorkHistoryByEmployee(employee.id);

  return (
    <div>
      {/* Header Card */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={24}>
          <Col xs={24} sm={24} md={6} style={{ textAlign: "center" }}>
            <Avatar
              size={AVATAR_SIZE}
              style={{ backgroundColor: "#1677ff", marginBottom: 16 }}
              icon={<UserOutlined />}
            >
              {employee.fullName.charAt(0)}
            </Avatar>
            <div>
              <h2 style={{ margin: "8px 0" }}>{employee.fullName}</h2>
              <p style={{ color: "#666", margin: "4px 0" }}>
                {employee.employeeCode}
              </p>
              <Tag color={getStatusColor(employee.status)}>
                {getStatusText(employee.status)}
              </Tag>
            </div>
          </Col>

          <Col xs={24} sm={24} md={18}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Space wrap>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate("/hr/employees")}
                >
                  Quay lại
                </Button>
                <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                  Chỉnh sửa
                </Button>
                <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
                  Xóa
                </Button>
              </Space>

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Space>
                    <MailOutlined style={{ fontSize: 16, color: "#1677ff" }} />
                    <div>
                      <div style={{ fontSize: 12, color: "#666" }}>Email</div>
                      <div>{employee.email}</div>
                    </div>
                  </Space>
                </Col>
                <Col xs={24} sm={12}>
                  <Space>
                    <PhoneOutlined style={{ fontSize: 16, color: "#1677ff" }} />
                    <div>
                      <div style={{ fontSize: 12, color: "#666" }}>
                        Số điện thoại
                      </div>
                      <div>{formatPhone(employee.phone)}</div>
                    </div>
                  </Space>
                </Col>
              </Row>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Details Tabs */}
      <Card>
        <Tabs
          defaultActiveKey="personal"
          items={[
            {
              key: "personal",
              label: "Thông tin cá nhân",
              children: (
                <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
                  <Descriptions.Item label="Họ và tên">
                    {employee.fullName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mã nhân viên">
                    {employee.employeeCode}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày sinh">
                    {formatDate(employee.dateOfBirth)} ({calculateAge(employee.dateOfBirth)} tuổi)
                  </Descriptions.Item>
                  <Descriptions.Item label="Giới tính">
                    {getGenderText(employee.gender)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {employee.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    {formatPhone(employee.phone)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ" span={2}>
                    {employee.address || "-"}
                  </Descriptions.Item>
                </Descriptions>
              ),
            },
            {
              key: "work",
              label: "Thông tin công việc",
              children: (
                <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
                  <Descriptions.Item label="Phòng ban">
                    {department?.name || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Chức vụ">
                    {position?.name || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Lương cơ bản">
                    {formatCurrency(employee.baseSalary)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <Tag color={getStatusColor(employee.status)}>
                      {getStatusText(employee.status)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày vào làm">
                    {formatDateLong(employee.joinDate)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày nghỉ việc">
                    {employee.resignDate ? formatDateLong(employee.resignDate) : "-"}
                  </Descriptions.Item>
                </Descriptions>
              ),
            },
            {
              key: "history",
              label: "Lịch sử công việc",
              children: (
                <div>
                  {workHistory.length > 0 ? (
                    <Timeline
                      items={workHistory.map((history) => ({
                        children: (
                          <div>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>
                              {history.action} - {formatDate(history.date)}
                            </div>
                            <div style={{ color: "#666" }}>
                              {history.description}
                            </div>
                            {history.previousPosition && history.newPosition && (
                              <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
                                {history.previousPosition} → {history.newPosition}
                              </div>
                            )}
                          </div>
                        ),
                      }))}
                    />
                  ) : (
                    <Empty description="Chưa có lịch sử công việc" />
                  )}
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default EmployeeDetail;
