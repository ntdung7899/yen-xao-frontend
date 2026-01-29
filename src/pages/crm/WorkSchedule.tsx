import React, { useState } from 'react';
import { Calendar, Badge, Button, Modal, Form, Input, Select, DatePicker, message, Card, Row, Col, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

interface CalendarEvent {
    id: string;
    type: 'leave' | 'late' | 'meeting' | 'other';
    content: string;
    date: string; // YYYY-MM-DD
    status: 'pending' | 'approved' | 'rejected';
}

const getListData = (value: Dayjs, events: CalendarEvent[]) => {
    const dateStr = value.format('YYYY-MM-DD');
    return events.filter(event => event.date === dateStr);
};

export const WorkSchedule: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [events, setEvents] = useState<CalendarEvent[]>([
        { id: '1', type: 'meeting', content: 'Họp team sales', date: dayjs().format('YYYY-MM-DD'), status: 'approved' },
        { id: '2', type: 'leave', content: 'Nghỉ phép năm', date: dayjs().add(2, 'day').format('YYYY-MM-DD'), status: 'pending' },
    ]);
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

    const onSelect = (newValue: Dayjs) => {
        setSelectedDate(newValue);
    };

    const onPanelChange = (newValue: Dayjs) => {
        setSelectedDate(newValue);
    };

    const handleCreateRequest = () => {
        setIsModalOpen(true);
        form.setFieldsValue({
            date: selectedDate,
            type: 'leave'
        });
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const newEvent: CalendarEvent = {
                id: Date.now().toString(),
                type: values.type,
                content: values.reason,
                date: values.date.format('YYYY-MM-DD'),
                status: 'pending',
            };

            setEvents([...events, newEvent]);
            setIsModalOpen(false);
            form.resetFields();
            message.success('Đã gửi yêu cầu cập nhật lịch làm việc');
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value, events);
        return (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {listData.map((item) => (
                    <li key={item.id}>
                        <Badge
                            status={item.type === 'leave' ? 'error' : item.type === 'late' ? 'warning' : 'success'}
                            text={item.content}
                        />
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <div>
                            <Title level={2} style={{ margin: 0 }}>Lịch làm việc</Title>
                            <span style={{ color: '#8c8c8c' }}>Quản lý lịch làm việc và đăng ký nghỉ phép</span>
                        </div>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRequest} size="large">
                            Cập nhật lịch làm
                        </Button>
                    </div>
                </Col>

                <Col span={24}>
                    <Card bordered={false}>
                        <Calendar
                            value={selectedDate}
                            onSelect={onSelect}
                            onPanelChange={onPanelChange}
                            cellRender={dateCellRender}
                        />
                    </Card>
                </Col>
            </Row>

            <Modal
                title="Cập nhật lịch làm việc"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Gửi yêu cầu"
                cancelText="Hủy"
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="schedule_form"
                >
                    <Form.Item
                        name="type"
                        label="Loại yêu cầu"
                        rules={[{ required: true, message: 'Vui lòng chọn loại yêu cầu' }]}
                    >
                        <Select>
                            <Option value="leave">Xin nghỉ</Option>
                            <Option value="late">Xin đi trễ / Về sớm</Option>
                            <Option value="other">Khác</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="date"
                        label="Ngày"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                    >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>

                    <Form.Item
                        name="reason"
                        label="Lý do"
                        rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}
                    >
                        <TextArea rows={4} placeholder="Nhập lý do chi tiết..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default WorkSchedule;
