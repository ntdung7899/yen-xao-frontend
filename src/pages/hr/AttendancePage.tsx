import { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Space, 
  message, 
  Calendar, 
  Badge, 
  Row, 
  Col, 
  Statistic, 
  Modal,
  Typography,
  Divider,
  Tag
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  SmileOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Attendance record interface
interface AttendanceRecord {
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'present' | 'late' | 'absent' | 'dayoff';
  hoursWorked: number | null;
  notes?: string;
}

// Generate mock attendance data for current month
const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const currentMonth = dayjs();
  const daysInMonth = currentMonth.daysInMonth();
  
  for (let i = 1; i <= daysInMonth; i++) {
    const date = currentMonth.date(i);
    const dayOfWeek = date.day();
    
    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }
    
    // Only generate records for past dates and today
    if (date.isAfter(dayjs(), 'day')) {
      continue;
    }
    
    const random = Math.random();
    let record: AttendanceRecord;
    
    if (random < 0.7) {
      // 70% present on time
      record = {
        date: date.format('YYYY-MM-DD'),
        checkIn: date.hour(8).minute(Math.floor(Math.random() * 30)).format('HH:mm:ss'),
        checkOut: date.hour(17).minute(Math.floor(Math.random() * 60)).format('HH:mm:ss'),
        status: 'present',
        hoursWorked: 8 + Math.random() * 2,
      };
    } else if (random < 0.85) {
      // 15% late
      record = {
        date: date.format('YYYY-MM-DD'),
        checkIn: date.hour(9).minute(Math.floor(Math.random() * 60)).format('HH:mm:ss'),
        checkOut: date.hour(17).minute(Math.floor(Math.random() * 60)).format('HH:mm:ss'),
        status: 'late',
        hoursWorked: 7 + Math.random() * 2,
        notes: 'Đến muộn',
      };
    } else if (random < 0.95) {
      // 10% absent
      record = {
        date: date.format('YYYY-MM-DD'),
        checkIn: null,
        checkOut: null,
        status: 'absent',
        hoursWorked: null,
        notes: 'Vắng mặt',
      };
    } else {
      // 5% day off
      record = {
        date: date.format('YYYY-MM-DD'),
        checkIn: null,
        checkOut: null,
        status: 'dayoff',
        hoursWorked: null,
        notes: 'Nghỉ phép',
      };
    }
    
    records.push(record);
  }
  
  return records;
};

export default function AttendancePage() {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [todayCheckedIn, setTodayCheckedIn] = useState(false);
  const [todayCheckInTime, setTodayCheckInTime] = useState<string | null>(null);
  const [todayCheckOutTime, setTodayCheckOutTime] = useState<string | null>(null);
  const [loadingCheckin, setLoadingCheckin] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [attendanceRecords] = useState<AttendanceRecord[]>(generateMockAttendance());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate statistics
  const stats = {
    totalDays: attendanceRecords.length,
    presentDays: attendanceRecords.filter(r => r.status === 'present' || r.status === 'late').length,
    lateDays: attendanceRecords.filter(r => r.status === 'late').length,
    totalHours: attendanceRecords
      .filter(r => r.hoursWorked !== null)
      .reduce((sum, r) => sum + (r.hoursWorked || 0), 0),
  };

  const handleCheckin = async () => {
    setLoadingCheckin(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const now = dayjs().format('HH:mm:ss');
    setTodayCheckInTime(now);
    setTodayCheckedIn(true);
    setLoadingCheckin(false);
    message.success(`Chấm công vào thành công lúc ${now}`);
  };

  const handleCheckout = async () => {
    setLoadingCheckout(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const now = dayjs().format('HH:mm:ss');
    setTodayCheckOutTime(now);
    setTodayCheckedIn(false);
    setLoadingCheckout(false);
    message.success(`Chấm công ra thành công lúc ${now}`);
  };

  // Get attendance record for a specific date
  const getAttendanceForDate = (date: Dayjs): AttendanceRecord | undefined => {
    return attendanceRecords.find(r => r.date === date.format('YYYY-MM-DD'));
  };

  // Calendar cell renderer
  const dateCellRender = (value: Dayjs) => {
    const record = getAttendanceForDate(value);
    if (!record) return null;

    const statusConfig = {
      present: { color: 'success', text: 'Có mặt', icon: <CheckOutlined /> },
      late: { color: 'warning', text: 'Muộn', icon: <WarningOutlined /> },
      absent: { color: 'error', text: 'Vắng', icon: <CloseCircleOutlined /> },
      dayoff: { color: 'processing', text: 'Nghỉ phép', icon: <SmileOutlined /> },
    };

    const config = statusConfig[record.status];

    return (
      <div style={{ padding: '2px 0' }}>
        <Badge 
          status={config.color as 'success' | 'error' | 'default' | 'processing' | 'warning'} 
          text={
            <span style={{ fontSize: 11 }}>
              {config.icon} {config.text}
            </span>
          } 
        />
      </div>
    );
  };

  // Handle date click
  const handleDateSelect = (date: Dayjs) => {
    const record = getAttendanceForDate(date);
    if (record) {
      setSelectedDate(date);
      setDetailModalVisible(true);
    }
  };

  // Get selected date details
  const selectedRecord = selectedDate ? getAttendanceForDate(selectedDate) : null;

  const getStatusTag = (status: string) => {
    const statusConfig = {
      present: { color: 'success', text: 'Có mặt đúng giờ' },
      late: { color: 'warning', text: 'Đến muộn' },
      absent: { color: 'error', text: 'Vắng mặt' },
      dayoff: { color: 'processing', text: 'Nghỉ phép' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <div style={{ padding: '0 24px' }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        <CalendarOutlined /> Chấm công & Lịch sử
      </Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card 
            bordered={false}
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Tổng ngày làm việc</span>}
              value={stats.totalDays}
              suffix="ngày"
              valueStyle={{ color: 'white' }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            bordered={false}
            style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white'
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Số ngày có mặt</span>}
              value={stats.presentDays}
              suffix={`/ ${stats.totalDays}`}
              valueStyle={{ color: 'white' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            bordered={false}
            style={{ 
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white'
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Số lần đến muộn</span>}
              value={stats.lateDays}
              suffix="lần"
              valueStyle={{ color: 'white' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            bordered={false}
            style={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white'
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Tổng giờ làm việc</span>}
              value={stats.totalHours.toFixed(1)}
              suffix="giờ"
              valueStyle={{ color: 'white' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[24, 24]}>
        {/* Check-in/Check-out Panel */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>Chấm công hôm nay</span>
              </Space>
            }
            bordered={false}
            style={{ 
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              height: '100%'
            }}
          >
            {/* Live Clock */}
            <div style={{ 
              textAlign: 'center', 
              padding: '24px 0',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 8,
              marginBottom: 24
            }}>
              <Title level={2} style={{ color: 'white', margin: 0, fontSize: 48 }}>
                {currentTime.format('HH:mm:ss')}
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>
                {currentTime.format('dddd, DD/MM/YYYY')}
              </Text>
            </div>

            {/* Status */}
            <div style={{ marginBottom: 24, textAlign: 'center' }}>
              {!todayCheckedIn && !todayCheckInTime ? (
                <Tag color="default" style={{ fontSize: 16, padding: '8px 16px' }}>
                  <UserOutlined /> Chưa chấm công
                </Tag>
              ) : todayCheckedIn ? (
                <Tag color="success" style={{ fontSize: 16, padding: '8px 16px' }}>
                  <CheckCircleOutlined /> Đang làm việc
                </Tag>
              ) : (
                <Tag color="processing" style={{ fontSize: 16, padding: '8px 16px' }}>
                  <CheckCircleOutlined /> Đã hoàn thành
                </Tag>
              )}
            </div>

            {/* Today's Summary */}
            {(todayCheckInTime || todayCheckOutTime) && (
              <div style={{ 
                background: '#f5f5f5', 
                padding: 16, 
                borderRadius: 8,
                marginBottom: 24
              }}>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {todayCheckInTime && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong>Giờ vào:</Text>
                      <Text style={{ color: '#52c41a' }}>{todayCheckInTime}</Text>
                    </div>
                  )}
                  {todayCheckOutTime && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong>Giờ ra:</Text>
                      <Text style={{ color: '#1890ff' }}>{todayCheckOutTime}</Text>
                    </div>
                  )}
                  {todayCheckInTime && todayCheckOutTime && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong>Tổng giờ:</Text>
                      <Text type="success">
                        {(() => {
                          const start = dayjs(`2000-01-01 ${todayCheckInTime}`);
                          const end = dayjs(`2000-01-01 ${todayCheckOutTime}`);
                          return end.diff(start, 'hour', true).toFixed(1);
                        })()}{' '}
                        giờ
                      </Text>
                    </div>
                  )}
                </Space>
              </div>
            )}

            {/* Check-in/Check-out Buttons */}
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Button
                type="primary"
                size="large"
                icon={<CheckCircleOutlined />}
                onClick={handleCheckin}
                loading={loadingCheckin}
                disabled={todayCheckedIn || todayCheckInTime !== null}
                block
                style={{ 
                  height: 56,
                  fontSize: 16,
                  fontWeight: 500,
                  background: todayCheckedIn || todayCheckInTime !== null ? undefined : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                Chấm công vào
              </Button>
              <Button
                type="default"
                size="large"
                icon={<ClockCircleOutlined />}
                onClick={handleCheckout}
                loading={loadingCheckout}
                disabled={!todayCheckedIn}
                block
                style={{ 
                  height: 56,
                  fontSize: 16,
                  fontWeight: 500
                }}
              >
                Chấm công ra
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Calendar View */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <CalendarOutlined />
                <span>Lịch sử chấm công</span>
              </Space>
            }
            bordered={false}
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
          >
            <Calendar 
              cellRender={dateCellRender}
              onSelect={handleDateSelect}
              style={{ 
                cursor: 'pointer'
              }}
            />
            <Divider />
            <div style={{ textAlign: 'center', color: '#8c8c8c' }}>
              <Space direction="vertical" size="small">
                <Text type="secondary">
                  💡 Nhấp vào ngày có chấm công để xem chi tiết
                </Text>
                <Space size="large" wrap>
                  <Space size="small">
                    <Badge status="success" />
                    <Text type="secondary">Có mặt</Text>
                  </Space>
                  <Space size="small">
                    <Badge status="warning" />
                    <Text type="secondary">Muộn</Text>
                  </Space>
                  <Space size="small">
                    <Badge status="error" />
                    <Text type="secondary">Vắng</Text>
                  </Space>
                  <Space size="small">
                    <Badge status="processing" />
                    <Text type="secondary">Nghỉ phép</Text>
                  </Space>
                </Space>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Detail Modal */}
      <Modal
        title={
          <Space>
            <CalendarOutlined />
            <span>Chi tiết chấm công</span>
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={500}
      >
        {selectedRecord && selectedDate && (
          <div>
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: 20,
              borderRadius: 8,
              marginBottom: 24,
              textAlign: 'center'
            }}>
              <Title level={3} style={{ color: 'white', margin: 0 }}>
                {selectedDate.format('DD/MM/YYYY')}
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>
                {selectedDate.format('dddd')}
              </Text>
            </div>

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong style={{ fontSize: 16 }}>Trạng thái:</Text>
                <div style={{ marginTop: 8 }}>
                  {getStatusTag(selectedRecord.status)}
                </div>
              </div>

              <Divider style={{ margin: 0 }} />

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card size="small" style={{ background: '#f0f5ff', border: 'none' }}>
                    <Statistic
                      title="Giờ vào"
                      value={selectedRecord.checkIn || '--:--:--'}
                      valueStyle={{ fontSize: 20, color: '#1890ff' }}
                      prefix={<CheckCircleOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" style={{ background: '#f6ffed', border: 'none' }}>
                    <Statistic
                      title="Giờ ra"
                      value={selectedRecord.checkOut || '--:--:--'}
                      valueStyle={{ fontSize: 20, color: '#52c41a' }}
                      prefix={<ClockCircleOutlined />}
                    />
                  </Card>
                </Col>
              </Row>

              <Card size="small" style={{ background: '#fff7e6', border: 'none' }}>
                <Statistic
                  title="Tổng giờ làm việc"
                  value={selectedRecord.hoursWorked?.toFixed(1) || 0}
                  suffix="giờ"
                  valueStyle={{ fontSize: 24, color: '#fa8c16' }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>

              {selectedRecord.notes && (
                <>
                  <Divider style={{ margin: 0 }} />
                  <div>
                    <Text strong>Ghi chú:</Text>
                    <div style={{ 
                      marginTop: 8,
                      padding: 12,
                      background: '#fafafa',
                      borderRadius: 4,
                      borderLeft: '3px solid #1890ff'
                    }}>
                      <Text>{selectedRecord.notes}</Text>
                    </div>
                  </div>
                </>
              )}
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
}
