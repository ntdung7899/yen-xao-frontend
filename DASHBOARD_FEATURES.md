# 📊 Dashboard - Chi tiết tính năng

## Tổng quan

Dashboard là trang chính của hệ thống HR Admin, cung cấp cái nhìn tổng quan về tình hình nhân sự thông qua các thống kê và biểu đồ trực quan.

## 🎯 Các chức năng chính

### 1. Statistics Cards (8 Cards)

#### Hàng 1 - Thống kê chính
1. **Tổng số nhân viên**
   - Icon: TeamOutlined (màu xanh primary)
   - Hiển thị: Tổng số nhân viên trong hệ thống
   - Giá trị: 16 nhân viên (từ mock data)

2. **Đang làm việc**
   - Icon: UserOutlined (màu xanh lá)
   - Hiển thị: Số nhân viên có status = "active"
   - Format: X / Total
   - Giá trị: ~13-14 nhân viên

3. **Tuyển mới tháng này**
   - Icon: UserAddOutlined (màu xanh primary)
   - Hiển thị: Số nhân viên join trong 30 ngày gần đây
   - Icon trend: RiseOutlined (nếu có tuyển mới)
   - Tính toán: So sánh joinDate với hiện tại

4. **Nghỉ việc tháng này**
   - Icon: UserDeleteOutlined (màu đỏ)
   - Hiển thị: Số nhân viên resignDate trong 30 ngày gần đây
   - Icon trend: FallOutlined (nếu có nghỉ việc)
   - Tính toán: So sánh resignDate với hiện tại

#### Hàng 2 - Thống kê bổ sung
5. **Lương trung bình**
   - Format: Currency VND (XX,XXX,XXX ₫)
   - Tính: Tổng lương / Số nhân viên
   - Giá trị: ~17,000,000 ₫

6. **Số phòng ban**
   - Hiển thị: Tổng số phòng ban
   - Giá trị: 5 phòng ban

7. **Tỷ lệ đang làm**
   - Format: Phần trăm (%)
   - Màu xanh lá
   - Tính: (Active / Total) * 100
   - Giá trị: ~80-90%

8. **Tỷ lệ nghỉ việc**
   - Format: Phần trăm (%)
   - Màu đỏ
   - Tính: (Resigned / Total) * 100
   - Giá trị: ~5-10%

### 2. Biểu đồ tròn (Pie Chart) - Trạng thái nhân viên

**Vị trí:** Cột trái, dưới statistics cards

**Dữ liệu hiển thị:**
- 🟢 Đang làm việc (Active) - Màu xanh lá (#52c41a)
- 🟡 Tạm nghỉ (Inactive) - Màu vàng (#faad14)
- 🔴 Đã nghỉ việc (Resigned) - Màu đỏ (#ff4d4f)

**Tính năng:**
- Hiển thị phần trăm trên từng phần
- Tooltip khi hover: Tên + Số lượng
- Legend bên dưới
- Responsive: Tự động resize theo màn hình

**Library:** Recharts PieChart component

### 3. Biểu đồ cột (Bar Chart) - Nhân viên theo phòng ban

**Vị trí:** Cột phải, dưới statistics cards

**Dữ liệu hiển thị:**
- Trục X: Mã phòng ban (IT, HR, SALES, MARKETING, FIN)
- Trục Y: Số lượng nhân viên
- Màu cột: Xanh primary (#1677ff)

**Tính năng:**
- Tooltip chi tiết:
  - Tên đầy đủ phòng ban
  - Số lượng nhân viên
- Grid lines để dễ đọc
- Responsive

**Library:** Recharts BarChart component

### 4. Biểu đồ đường (Line Chart) - Xu hướng tuyển dụng

**Vị trí:** Full width, dưới 2 biểu đồ trên

**Dữ liệu hiển thị:**
- Trục X: 6 tháng gần đây (Tháng 8 → Tháng 1)
- Trục Y: Số lượng nhân viên
- 2 đường:
  - 🟢 **Tuyển mới** (màu xanh lá #52c41a)
  - 🔴 **Nghỉ việc** (màu đỏ #ff4d4f)

**Tính năng:**
- Tooltip hiển thị cả 2 giá trị
- Legend phân biệt 2 đường
- ActiveDot: Chấm nổi bật khi hover
- Grid lines
- Responsive

**Mock data:** 
```typescript
const monthlyData = [
  { month: "Tháng 8", new: 2, resigned: 1 },
  { month: "Tháng 9", new: 3, resigned: 0 },
  { month: "Tháng 10", new: 1, resigned: 1 },
  { month: "Tháng 11", new: 4, resigned: 2 },
  { month: "Tháng 12", new: 2, resigned: 0 },
  { month: "Tháng 1", new: [động], resigned: [động] },
];
```

**Library:** Recharts LineChart component

## 🎨 Layout & Responsive

### Desktop (>= 1024px)
```
+---------------------------+---------------------------+
|  Tổng NV  | Đang làm | Tuyển mới | Nghỉ việc        |
+---------------------------+---------------------------+
| Lương TB  | Phòng ban | Tỷ lệ làm | Tỷ lệ nghỉ       |
+---------------------------+---------------------------+
|   Pie Chart (50%)         |   Bar Chart (50%)        |
|   Trạng thái NV           |   NV theo phòng ban      |
+---------------------------+---------------------------+
|            Line Chart (100%)                         |
|            Xu hướng 6 tháng                          |
+------------------------------------------------------+
```

### Tablet (768px - 1023px)
- Cards: 2 cards per row
- Charts: Pie và Bar mỗi cái chiếm full width
- Line chart: Full width

### Mobile (< 768px)
- Cards: 1 card per row (stack vertical)
- Charts: Tất cả full width, stack vertical

## 📊 Tính toán dữ liệu

### Active Employees
```typescript
const activeEmployees = mockEmployees.filter(
  (emp) => emp.status === "active"
).length;
```

### New Employees This Month
```typescript
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
const newEmployeesThisMonth = mockEmployees.filter((emp) => {
  const joinDate = new Date(emp.joinDate);
  return joinDate >= oneMonthAgo;
}).length;
```

### Resigned This Month
```typescript
const resignedThisMonth = mockEmployees.filter((emp) => {
  if (!emp.resignDate) return false;
  const resignDate = new Date(emp.resignDate);
  return resignDate >= oneMonthAgo;
}).length;
```

### Average Salary
```typescript
const averageSalary =
  mockEmployees.reduce((sum, emp) => sum + emp.baseSalary, 0) /
  mockEmployees.length;
```

### Department Employees Count
```typescript
const departmentData = mockDepartments.map((dept) => ({
  name: dept.code,
  fullName: dept.name,
  count: getEmployeesByDepartment(dept.id).length,
}));
```

## 🎯 Use Cases

### 1. HR Manager
- Nhìn nhanh tình hình nhân sự
- Theo dõi xu hướng tuyển dụng/nghỉ việc
- So sánh số lượng nhân viên giữa các phòng ban

### 2. Director/CEO
- Overview về tổng số nhân viên
- Tỷ lệ retention (đang làm vs nghỉ việc)
- Chi phí nhân sự trung bình

### 3. Recruiter
- Theo dõi số lượng tuyển mới
- Xu hướng tuyển dụng 6 tháng
- Phòng ban nào cần tuyển thêm

## 🚀 Future Enhancements

### Có thể thêm:
1. **Filter by date range**
   - Chọn khoảng thời gian xem thống kê
   - DateRangePicker component

2. **Export reports**
   - Export charts as PNG/PDF
   - Export data as Excel

3. **More charts**
   - Biểu đồ lương theo phòng ban
   - Biểu đồ độ tuổi nhân viên
   - Biểu đồ giới tính

4. **Real-time updates**
   - Auto refresh mỗi X phút
   - WebSocket updates

5. **Drill-down**
   - Click vào phòng ban → xem danh sách nhân viên
   - Click vào status → filter employees

6. **Comparison**
   - So sánh với tháng trước
   - Growth rate %
   - Trend indicators (↑ ↓)

## 🔧 Technical Details

### Dependencies
- **recharts**: ^3.6.0
- **antd**: ^5.12.8 (Card, Row, Col, Statistic)
- **@ant-design/icons**: ^5.2.6 (Icons)

### Components Used
- `ResponsiveContainer` - Auto resize charts
- `PieChart` + `Pie` + `Cell` - Pie chart
- `BarChart` + `Bar` - Bar chart
- `LineChart` + `Line` - Line chart
- `XAxis`, `YAxis` - Axes
- `CartesianGrid` - Grid lines
- `Tooltip` - Hover tooltips
- `Legend` - Chart legends

### Performance
- All charts use ResponsiveContainer
- No heavy computations
- Static mock data (fast)
- Will need optimization with real API data

### Accessibility
- Color contrast compliant
- Tooltips for additional info
- Semantic HTML structure
- Screen reader friendly

## 📝 Notes

1. **Mock data**: Tháng 1 (tháng hiện tại) sử dụng dữ liệu tính toán động từ mock employees. Các tháng trước là dữ liệu giả định.

2. **Date calculations**: Sử dụng JavaScript Date object. Có thể thay bằng Day.js để chính xác hơn.

3. **Responsive**: Tất cả charts đều responsive với ResponsiveContainer width="100%" height={300}.

4. **Colors**: Tuân theo Ant Design color palette và consistent với toàn bộ app.

---

**Dashboard is ready! 🎉**
