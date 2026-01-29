import { useState, useMemo } from 'react';
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
    Row,
    Col,
    Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    SearchOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '@/contexts/AuthContext';
import { LeaveRequest } from '@/types/hr.types';
import { mockUsers } from '@/data/mockAuthData';

const { Title } = Typography;
const { Option } = Select;

// Mock Data for Requests
// In a real app, this would come from an API
const generateMockRequests = (): LeaveRequest[] => {
    return [
        {
            id: 'req-1',
            employeeId: 'user-3',
            employeeName: 'Lê Văn Sale',
            departmentId: 'dept-1', // Sales
            type: 'leave',
            startDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
            endDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
            reason: 'Nghỉ phép thường niên',
            status: 'pending',
            createdAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
        },
        {
            id: 'req-2',
            employeeId: 'user-7',
            employeeName: 'Vũ Văn Sale 3',
            departmentId: 'dept-1', // Sales
            type: 'late',
            startDate: dayjs().format('YYYY-MM-DD'),
            endDate: dayjs().format('YYYY-MM-DD'),
            reason: 'Đưa con đi khám bệnh, xin đến muộn 1h',
            status: 'pending',
            createdAt: dayjs().subtract(2, 'hour').format('YYYY-MM-DD HH:mm'),
        },
        {
            id: 'req-3',
            employeeId: 'user-5',
            employeeName: 'Hoàng Văn HR Staff',
            departmentId: 'dept-2', // HR
            type: 'leave',
            startDate: dayjs().subtract(5, 'day').format('YYYY-MM-DD'),
            endDate: dayjs().subtract(4, 'day').format('YYYY-MM-DD'),
            reason: 'Việc gia đình',
            status: 'approved',
            createdAt: dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm'),
        },
        {
            id: 'req-4',
            employeeId: 'user-6',
            employeeName: 'Đỗ Thị Sale 2',
            departmentId: 'dept-1', // Sales
            type: 'early',
            startDate: dayjs().add(3, 'day').format('YYYY-MM-DD'),
            endDate: dayjs().add(3, 'day').format('YYYY-MM-DD'),
            reason: 'Về sớm đón người thân',
            status: 'rejected',
            createdAt: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm'),
        },
        {
            id: 'req-5',
            employeeId: 'user-8',
            employeeName: 'Nguyễn Văn Supervisor',
            departmentId: 'dept-1',
            type: 'leave',
            startDate: dayjs().add(10, 'day').format('YYYY-MM-DD'),
            endDate: dayjs().add(12, 'day').format('YYYY-MM-DD'),
            reason: 'Du lịch',
            status: 'pending',
            createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
        }
    ];
};

const LeaveRequestList = () => {
    const { user, hasPermission } = useAuth();
    const [requests, setRequests] = useState<LeaveRequest[]>(generateMockRequests());
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('pending');
    const [typeFilter, setTypeFilter] = useState<string | null>(null);

    // Filter Data (My Team Logic included)
    const filteredRequests = useMemo(() => {
        let data = requests;

        // 1. Permission Based Filtering (Team vs All)
        if (!hasPermission('attendance:view_all')) {
            // If not viewing all, filter by team or department
            if (hasPermission('attendance:view_team')) {
                const currentUser = mockUsers.find(u => u.id === user?.id);
                if (currentUser?.teamId) {
                    // Get IDs of users in the same team
                    const teamMemberIds = mockUsers
                        .filter(u => u.teamId === currentUser.teamId) // Could include self or not depending on policy. Usually approves for subordinates.
                        .map(u => u.id);

                    // If I am supervisor, I should see requests from my team members.
                    // Assuming hierarchy is flat in this mock: Supervisor manages team.
                    data = data.filter(req => teamMemberIds.includes(req.employeeId));
                } else {
                    // Determine logic if no team assigned but has team permission? 
                    // Fallback to empty or specific logic.
                    // For this mock, assume if no team, sees nothing or just self (which doesn't make sense for approval).
                    data = [];
                }
            } else if (hasPermission('attendance:view_department')) {
                data = data.filter(req => req.departmentId === user?.departmentId);
            }
        }
        // If has 'attendance:view_all', shows all (data remains as is)

        // 2. Status Filter
        if (statusFilter && statusFilter !== 'all') {
            data = data.filter(req => req.status === statusFilter);
        }

        // 3. Type Filter
        if (typeFilter && typeFilter !== 'all') {
            data = data.filter(req => req.type === typeFilter);
        }

        // 4. Search Filter
        if (searchText) {
            const lowerSearch = searchText.toLowerCase();
            data = data.filter(
                req =>
                    req.employeeName.toLowerCase().includes(lowerSearch) ||
                    req.reason.toLowerCase().includes(lowerSearch)
            );
        }

        return data;
    }, [requests, user, hasPermission, searchText, statusFilter, typeFilter]);

    const handleApprove = (id: string) => {
        Modal.confirm({
            title: 'Xác nhận duyệt',
            content: 'Bạn có chắc chắn muốn duyệt yêu cầu này?',
            okText: 'Duyệt',
            cancelText: 'Hủy',
            onOk: () => {
                setRequests(prev =>
                    prev.map(req => (req.id === id ? { ...req, status: 'approved' } : req))
                );
                message.success('Đã duyệt yêu cầu thành công');
            },
        });
    };

    const handleReject = (id: string) => {
        Modal.confirm({
            title: 'Xác nhận từ chối',
            content: 'Bạn có chắc chắn muốn từ chối yêu cầu này?',
            okText: 'Từ chối',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => {
                setRequests(prev =>
                    prev.map(req => (req.id === id ? { ...req, status: 'rejected' } : req))
                );
                message.success('Đã từ chối yêu cầu');
            },
        });
    };

    const columns: ColumnsType<LeaveRequest> = [
        {
            title: 'Nhân viên',
            dataIndex: 'employeeName',
            key: 'employeeName',
            render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                const config = {
                    leave: { color: 'orange', text: 'Nghỉ phép' },
                    late: { color: 'blue', text: 'Đi muộn' },
                    early: { color: 'cyan', text: 'Về sớm' },
                    other: { color: 'default', text: 'Khác' },
                };
                const c = config[type as keyof typeof config];
                return <Tag color={c.color}>{c.text}</Tag>;
            },
        },
        {
            title: 'Thời gian',
            key: 'time',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <span>{record.startDate === record.endDate ? record.startDate : `${record.startDate} - ${record.endDate}`}</span>
                    <span style={{ fontSize: 12, color: '#888' }}>
                        Đã tạo: {record.createdAt}
                    </span>
                </Space>
            ),
        },
        {
            title: 'Lý do',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const config = {
                    pending: { color: 'warning', text: 'Chờ duyệt', icon: <ClockCircleOutlined /> },
                    approved: { color: 'success', text: 'Đã duyệt', icon: <CheckCircleOutlined /> },
                    rejected: { color: 'error', text: 'Từ chối', icon: <CloseCircleOutlined /> },
                };
                const c = config[status as keyof typeof config];
                return (
                    <Tag color={c.color} icon={c.icon}>
                        {c.text}
                    </Tag>
                );
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    {record.status === 'pending' && (
                        <>
                            <Button
                                type="primary"
                                size="small"
                                icon={<CheckCircleOutlined />}
                                onClick={() => handleApprove(record.id)}
                            >
                                Duyệt
                            </Button>
                            <Button
                                danger
                                size="small"
                                icon={<CloseCircleOutlined />}
                                onClick={() => handleReject(record.id)}
                            >
                                Từ chối
                            </Button>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>Duyệt nghỉ phép / Đi trễ</Title>
            </div>

            <Card style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                        <Input
                            placeholder="Tìm theo tên hoặc lý do..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Col>
                    <Col xs={12} md={4}>
                        <Select
                            style={{ width: '100%' }}
                            value={statusFilter}
                            onChange={setStatusFilter}
                            placeholder="Trạng thái"
                        >
                            <Option value="all">Tất cả trạng thái</Option>
                            <Option value="pending">Chờ duyệt</Option>
                            <Option value="approved">Đã duyệt</Option>
                            <Option value="rejected">Từ chối</Option>
                        </Select>
                    </Col>
                    <Col xs={12} md={4}>
                        <Select
                            style={{ width: '100%' }}
                            value={typeFilter}
                            onChange={setTypeFilter}
                            placeholder="Loại yêu cầu"
                            allowClear
                        >
                            <Option value="leave">Nghỉ phép</Option>
                            <Option value="late">Đi muộn</Option>
                            <Option value="early">Về sớm</Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            <Table
                columns={columns}
                dataSource={filteredRequests}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default LeaveRequestList;
