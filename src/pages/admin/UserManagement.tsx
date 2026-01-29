import { useState } from 'react';
import {
    Table,
    Button,
    Tag,
    Space,
    Card,
    Input,
    Select,
    message,
    Modal,
    Form,
    Switch,
    Typography,
    Tooltip,
    Popconfirm
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    LockOutlined,
    UnlockOutlined,
    UserOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { User, Role } from '@/types/auth.types';
import { mockUsers, ROLE_PERMISSIONS, mockDepartments } from '@/data/mockAuthData';
import { useAuth } from '@/contexts/AuthContext';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const roles: { value: Role; label: string }[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'hr_manager', label: 'HR Manager' },
    { value: 'crm_manager', label: 'CRM Manager' },
    { value: 'sale', label: 'Sales Staff' },
    { value: 'hr_staff', label: 'HR Staff' },
    { value: 'supervisor', label: 'Supervisor' },
];

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [form] = Form.useForm();
    const { user: currentUser } = useAuth(); // To prevent deleting/locking self

    // Filter Users
    const filteredUsers = users.filter(
        (u) =>
            u.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
            u.username.toLowerCase().includes(searchText.toLowerCase()) ||
            u.email.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleEdit = (record: User) => {
        setEditingUser(record);
        form.setFieldsValue({
            ...record,
            departmentId: record.departmentId || undefined,
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setUsers(users.filter(u => u.id !== id));
        message.success('Đã xóa người dùng');
    };

    const handleToggleStatus = (record: User) => {
        const newStatus = !record.isActive;
        setUsers(users.map(u => u.id === record.id ? { ...u, isActive: newStatus } : u));
        message.success(`Đã ${newStatus ? 'mở khóa' : 'khóa'} tài khoản ${record.username}`);
    };

    const handleAdd = () => {
        setEditingUser(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleModalOk = () => {
        form.validateFields().then(values => {
            if (editingUser) {
                // Update existing
                const updatedUser: User = {
                    ...editingUser,
                    ...values,
                    permissions: ROLE_PERMISSIONS[values.role as Role] || [],
                };
                setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
                message.success('Cập nhật thành công');
            } else {
                // Create new
                const newUser: User = {
                    id: `user-${Date.now()}`,
                    ...values,
                    permissions: ROLE_PERMISSIONS[values.role as Role] || [],
                    isActive: true, // Default active for new users? or take from form
                    avatar: undefined
                };
                if (values.isActive === undefined) newUser.isActive = true;

                setUsers([...users, newUser]);
                message.success('Tạo người dùng mới thành công');
            }
            setIsModalOpen(false);
        });
    };

    const columns: ColumnsType<User> = [
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Vai trò (Role)',
            dataIndex: 'role',
            key: 'role',
            render: (role: Role) => {
                let color = 'geekblue';
                if (role === 'admin') color = 'red';
                if (role.includes('manager')) color = 'gold';
                if (role === 'supervisor') color = 'purple';

                return <Tag color={color}>{role.toUpperCase()}</Tag>;
            }
        },
        {
            title: 'Phòng ban',
            dataIndex: 'departmentId',
            key: 'departmentId',
            render: (deptId: string) => {
                const dept = mockDepartments.find(d => d.id === deptId);
                return dept ? dept.name : '-';
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'success' : 'error'}>
                    {isActive ? 'Hoạt động' : 'Đã khóa'}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chỉnh sửa / Gán quyền">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    {record.id !== currentUser?.id && (
                        <>
                            <Tooltip title={record.isActive ? "Khóa tài khoản" : "Mở khóa"}>
                                <Button
                                    type={record.isActive ? "default" : "primary"}
                                    danger={record.isActive}
                                    icon={record.isActive ? <LockOutlined /> : <UnlockOutlined />}
                                    size="small"
                                    onClick={() => handleToggleStatus(record)}
                                    style={!record.isActive ? { backgroundColor: '#52c41a', borderColor: '#52c41a' } : {}}
                                />
                            </Tooltip>
                            <Popconfirm
                                title="Bạn có chắc chắn muốn xóa người dùng này?"
                                onConfirm={() => handleDelete(record.id)}
                                okText="Xóa"
                                cancelText="Hủy"
                                okButtonProps={{ danger: true }}
                            >
                                <Button danger icon={<DeleteOutlined />} size="small" />
                            </Popconfirm>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>Quản lý người dùng</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Thêm người dùng
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Search
                        placeholder="Tìm kiếm người dùng..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={setSearchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ maxWidth: 400 }}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey="id"
                />
            </Card>

            <Modal
                title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ isActive: true }}
                >
                    <Form.Item
                        name="username"
                        label="Tên đăng nhập"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
                    >
                        <Input prefix={<UserOutlined />} disabled={!!editingUser} />
                    </Form.Item>

                    <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label="Vai trò (Role)"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                    >
                        <Select>
                            {roles.map(r => (
                                <Option key={r.value} value={r.value}>{r.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="departmentId"
                        label="Phòng ban"
                    >
                        <Select allowClear>
                            {mockDepartments.map(d => (
                                <Option key={d.id} value={d.id}>{d.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="isActive"
                        label="Trạng thái hoạt động"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Hoạt động" unCheckedChildren="Đã khóa" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;
