import { Employee, Department, Position, WorkHistory } from "@/types/hr.types";

// Mock Departments
export const mockDepartments: Department[] = [
  {
    id: "dept-1",
    code: "IT",
    name: "Công nghệ thông tin",
    description: "Phòng ban phát triển và quản lý hệ thống công nghệ",
    managerId: "emp-1",
    createdAt: "2023-01-15",
  },
  {
    id: "dept-2",
    code: "HR",
    name: "Nhân sự",
    description: "Phòng quản lý nguồn nhân lực",
    managerId: "emp-5",
    createdAt: "2023-01-15",
  },
  {
    id: "dept-3",
    code: "SALES",
    name: "Kinh doanh",
    description: "Phòng kinh doanh và phát triển thị trường",
    managerId: "emp-8",
    createdAt: "2023-01-15",
  },
  {
    id: "dept-4",
    code: "MARKETING",
    name: "Marketing",
    description: "Phòng marketing và truyền thông",
    managerId: "emp-12",
    createdAt: "2023-01-15",
  },
  {
    id: "dept-5",
    code: "FIN",
    name: "Kế toán - Tài chính",
    description: "Phòng quản lý tài chính và kế toán",
    managerId: "emp-15",
    createdAt: "2023-01-15",
  },
];

// Mock Positions
export const mockPositions: Position[] = [
  { id: "pos-1", code: "CEO", name: "Giám đốc điều hành", level: 1, description: "CEO" },
  { id: "pos-2", code: "CTO", name: "Giám đốc công nghệ", level: 1, description: "CTO" },
  { id: "pos-3", code: "MGR", name: "Quản lý", level: 2, description: "Manager" },
  { id: "pos-4", code: "TL", name: "Trưởng nhóm", level: 3, description: "Team Leader" },
  { id: "pos-5", code: "SR", name: "Nhân viên cấp cao", level: 4, description: "Senior" },
  { id: "pos-6", code: "MID", name: "Nhân viên", level: 5, description: "Middle" },
  { id: "pos-7", code: "JR", name: "Nhân viên mới", level: 6, description: "Junior" },
  { id: "pos-8", code: "INTERN", name: "Thực tập sinh", level: 7, description: "Intern" },
];

// Mock Employees
export const mockEmployees: Employee[] = [
  // Employees from mockAuthData (matching User IDs)
  {
    id: 'user-1',
    employeeCode: 'EMP001',
    fullName: 'Nguyễn Văn Admin',
    dateOfBirth: '1985-01-15',
    gender: 'male' as const,
    email: 'admin@company.com',
    phone: '0901234567',
    departmentId: 'dept-3',
    positionId: 'pos-1',
    baseSalary: 50000000,
    status: 'active' as const,
    joinDate: '2020-01-15',
    avatar: '👨‍💼',
  },
  {
    id: 'user-2',
    employeeCode: 'EMP002',
    fullName: 'Trần Thị Manager',
    dateOfBirth: '1988-03-20',
    gender: 'female' as const,
    email: 'crm.manager@company.com',
    phone: '0902234567',
    departmentId: 'dept-1',
    positionId: 'pos-2',
    baseSalary: 35000000,
    status: 'active' as const,
    joinDate: '2020-06-01',
    avatar: '👩‍💼',
  },
  {
    id: 'user-3',
    employeeCode: 'EMP003',
    fullName: 'Lê Văn Sale',
    dateOfBirth: '1992-07-10',
    gender: 'male' as const,
    email: 'sale1@company.com',
    phone: '0903234567',
    departmentId: 'dept-1',
    positionId: 'pos-3',
    baseSalary: 15000000,
    status: 'active' as const,
    joinDate: '2021-03-15',
    avatar: '🧑‍💼',
  },
  {
    id: 'user-4',
    employeeCode: 'EMP004',
    fullName: 'Phạm Thị HR Manager',
    dateOfBirth: '1987-05-12',
    gender: 'female' as const,
    email: 'hr.manager@company.com',
    phone: '0904234567',
    departmentId: 'dept-2',
    positionId: 'pos-4',
    baseSalary: 30000000,
    status: 'active' as const,
    joinDate: '2020-09-01',
    avatar: '👩‍💼',
  },
  {
    id: 'user-5',
    employeeCode: 'EMP005',
    fullName: 'Hoàng Văn HR Staff',
    dateOfBirth: '1995-11-25',
    gender: 'male' as const,
    email: 'hr.staff@company.com',
    phone: '0905234567',
    departmentId: 'dept-2',
    positionId: 'pos-5',
    baseSalary: 12000000,
    status: 'active' as const,
    joinDate: '2022-01-10',
    avatar: '🧑‍💼',
  },
  {
    id: 'user-6',
    employeeCode: 'EMP006',
    fullName: 'Đỗ Thị Sale 2',
    dateOfBirth: '1993-02-14',
    gender: 'female' as const,
    email: 'sale2@company.com',
    phone: '0906234567',
    departmentId: 'dept-1',
    positionId: 'pos-3',
    baseSalary: 14000000,
    status: 'active' as const,
    joinDate: '2021-07-01',
    avatar: '👩‍💼',
  },
  {
    id: 'user-7',
    employeeCode: 'EMP007',
    fullName: 'Vũ Văn Sale 3',
    dateOfBirth: '1994-08-30',
    gender: 'male' as const,
    email: 'sale3@company.com',
    phone: '0907234567',
    departmentId: 'dept-1',
    positionId: 'pos-3',
    baseSalary: 13000000,
    status: 'active' as const,
    joinDate: '2022-02-15',
    avatar: '🧑‍💼',
  },
  // Existing Mock Employees
  {
    id: "emp-1",
    employeeCode: "NV001",
    fullName: "Nguyễn Văn An",
    dateOfBirth: "1985-05-15",
    gender: "male",
    email: "an.nguyen@company.com",
    phone: "0901234567",
    departmentId: "dept-1",
    positionId: "pos-3",
    baseSalary: 25000000,
    status: "active",
    joinDate: "2020-01-10",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
  },
  {
    id: "emp-2",
    employeeCode: "NV002",
    fullName: "Trần Thị Bình",
    dateOfBirth: "1990-08-20",
    gender: "female",
    email: "binh.tran@company.com",
    phone: "0912345678",
    departmentId: "dept-1",
    positionId: "pos-5",
    baseSalary: 18000000,
    status: "active",
    joinDate: "2021-03-15",
    address: "456 Lê Lợi, Quận 3, TP.HCM",
  },
  {
    id: "emp-3",
    employeeCode: "NV003",
    fullName: "Lê Minh Cường",
    dateOfBirth: "1992-12-05",
    gender: "male",
    email: "cuong.le@company.com",
    phone: "0923456789",
    departmentId: "dept-1",
    positionId: "pos-6",
    baseSalary: 15000000,
    status: "active",
    joinDate: "2022-06-01",
    address: "789 Trần Hưng Đạo, Quận 5, TP.HCM",
  },
  {
    id: "emp-4",
    employeeCode: "NV004",
    fullName: "Phạm Thu Dung",
    dateOfBirth: "1995-03-10",
    gender: "female",
    email: "dung.pham@company.com",
    phone: "0934567890",
    departmentId: "dept-1",
    positionId: "pos-7",
    baseSalary: 12000000,
    status: "active",
    joinDate: "2023-02-20",
    address: "321 Võ Văn Tần, Quận 3, TP.HCM",
  },
  {
    id: "emp-5",
    employeeCode: "NV005",
    fullName: "Hoàng Văn Em",
    dateOfBirth: "1988-07-25",
    gender: "male",
    email: "em.hoang@company.com",
    phone: "0945678901",
    departmentId: "dept-2",
    positionId: "pos-3",
    baseSalary: 23000000,
    status: "active",
    joinDate: "2020-05-01",
    address: "654 Cách Mạng Tháng 8, Quận 10, TP.HCM",
  },
  {
    id: "emp-6",
    employeeCode: "NV006",
    fullName: "Vũ Thị Phương",
    dateOfBirth: "1991-11-18",
    gender: "female",
    email: "phuong.vu@company.com",
    phone: "0956789012",
    departmentId: "dept-2",
    positionId: "pos-6",
    baseSalary: 14000000,
    status: "active",
    joinDate: "2021-09-10",
    address: "987 Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
  },
  {
    id: "emp-7",
    employeeCode: "NV007",
    fullName: "Đặng Quốc Gia",
    dateOfBirth: "1993-04-08",
    gender: "male",
    email: "gia.dang@company.com",
    phone: "0967890123",
    departmentId: "dept-2",
    positionId: "pos-7",
    baseSalary: 11000000,
    status: "resigned",
    joinDate: "2022-01-15",
    resignDate: "2023-12-31",
    address: "147 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
  },
  {
    id: "emp-8",
    employeeCode: "NV008",
    fullName: "Bùi Thu Hà",
    dateOfBirth: "1987-09-30",
    gender: "female",
    email: "ha.bui@company.com",
    phone: "0978901234",
    departmentId: "dept-3",
    positionId: "pos-3",
    baseSalary: 24000000,
    status: "active",
    joinDate: "2019-11-20",
    address: "258 Lý Thường Kiệt, Quận 11, TP.HCM",
  },
  {
    id: "emp-9",
    employeeCode: "NV009",
    fullName: "Trương Văn Ích",
    dateOfBirth: "1994-02-14",
    gender: "male",
    email: "ich.truong@company.com",
    phone: "0989012345",
    departmentId: "dept-3",
    positionId: "pos-5",
    baseSalary: 17000000,
    status: "active",
    joinDate: "2021-07-01",
    address: "369 Hai Bà Trưng, Quận 3, TP.HCM",
  },
  {
    id: "emp-10",
    employeeCode: "NV010",
    fullName: "Phan Thị Kim",
    dateOfBirth: "1996-06-22",
    gender: "female",
    email: "kim.phan@company.com",
    phone: "0990123456",
    departmentId: "dept-3",
    positionId: "pos-6",
    baseSalary: 13500000,
    status: "active",
    joinDate: "2022-10-05",
    address: "741 Nguyễn Đình Chiểu, Quận 3, TP.HCM",
  },
  {
    id: "emp-11",
    employeeCode: "NV011",
    fullName: "Lý Minh Long",
    dateOfBirth: "1989-01-12",
    gender: "male",
    email: "long.ly@company.com",
    phone: "0901234561",
    departmentId: "dept-3",
    positionId: "pos-4",
    baseSalary: 20000000,
    status: "active",
    joinDate: "2020-08-15",
    address: "852 Pasteur, Quận 1, TP.HCM",
  },
  {
    id: "emp-12",
    employeeCode: "NV012",
    fullName: "Võ Thị Mai",
    dateOfBirth: "1990-10-05",
    gender: "female",
    email: "mai.vo@company.com",
    phone: "0912345672",
    departmentId: "dept-4",
    positionId: "pos-3",
    baseSalary: 22000000,
    status: "active",
    joinDate: "2020-03-10",
    address: "963 Cộng Hòa, Quận Tân Bình, TP.HCM",
  },
  {
    id: "emp-13",
    employeeCode: "NV013",
    fullName: "Đinh Văn Nam",
    dateOfBirth: "1992-05-28",
    gender: "male",
    email: "nam.dinh@company.com",
    phone: "0923456783",
    departmentId: "dept-4",
    positionId: "pos-5",
    baseSalary: 16000000,
    status: "active",
    joinDate: "2021-11-22",
    address: "159 Ba Tháng Hai, Quận 10, TP.HCM",
  },
  {
    id: "emp-14",
    employeeCode: "NV014",
    fullName: "Ngô Thị Oanh",
    dateOfBirth: "1995-08-16",
    gender: "female",
    email: "oanh.ngo@company.com",
    phone: "0934567894",
    departmentId: "dept-4",
    positionId: "pos-6",
    baseSalary: 14500000,
    status: "inactive",
    joinDate: "2022-04-18",
    address: "357 Lạc Long Quân, Quận 11, TP.HCM",
  },
  {
    id: "emp-15",
    employeeCode: "NV015",
    fullName: "Dương Văn Phúc",
    dateOfBirth: "1986-12-01",
    gender: "male",
    email: "phuc.duong@company.com",
    phone: "0945678905",
    departmentId: "dept-5",
    positionId: "pos-3",
    baseSalary: 26000000,
    status: "active",
    joinDate: "2019-07-05",
    address: "753 Trường Chinh, Quận Tân Bình, TP.HCM",
  },
  {
    id: "emp-16",
    employeeCode: "NV016",
    fullName: "Cao Thị Quỳnh",
    dateOfBirth: "1991-03-19",
    gender: "female",
    email: "quynh.cao@company.com",
    phone: "0956789016",
    departmentId: "dept-5",
    positionId: "pos-5",
    baseSalary: 17500000,
    status: "active",
    joinDate: "2021-02-14",
    address: "486 Hoàng Văn Thụ, Quận Phú Nhuận, TP.HCM",
  },
];

// Mock Work History
export const mockWorkHistory: WorkHistory[] = [
  {
    id: "wh-1",
    employeeId: "emp-1",
    action: "Tuyển dụng",
    date: "2020-01-10",
    description: "Nhân viên chính thức gia nhập công ty",
  },
  {
    id: "wh-2",
    employeeId: "emp-1",
    action: "Thăng chức",
    date: "2022-01-10",
    description: "Thăng chức từ Nhân viên cấp cao lên Quản lý",
    previousPosition: "Nhân viên cấp cao",
    newPosition: "Quản lý",
  },
  {
    id: "wh-3",
    employeeId: "emp-2",
    action: "Tuyển dụng",
    date: "2021-03-15",
    description: "Nhân viên chính thức gia nhập công ty",
  },
  {
    id: "wh-4",
    employeeId: "emp-7",
    action: "Tuyển dụng",
    date: "2022-01-15",
    description: "Nhân viên chính thức gia nhập công ty",
  },
  {
    id: "wh-5",
    employeeId: "emp-7",
    action: "Nghỉ việc",
    date: "2023-12-31",
    description: "Nghỉ việc theo nguyện vọng cá nhân",
  },
];

// Helper Functions
export const getDepartmentById = (id: string): Department | undefined => {
  return mockDepartments.find((dept) => dept.id === id);
};

export const getPositionById = (id: string): Position | undefined => {
  return mockPositions.find((pos) => pos.id === id);
};

export const getEmployeesByDepartment = (departmentId: string): Employee[] => {
  return mockEmployees.filter((emp) => emp.departmentId === departmentId);
};

export const getEmployeeById = (id: string): Employee | undefined => {
  return mockEmployees.find((emp) => emp.id === id);
};

export const getWorkHistoryByEmployee = (employeeId: string): WorkHistory[] => {
  return mockWorkHistory.filter((wh) => wh.employeeId === employeeId);
};

export const getEmployeeCountByDepartment = (departmentId: string): number => {
  return mockEmployees.filter(
    (emp) => emp.departmentId === departmentId && emp.status !== "resigned"
  ).length;
};

// Generate new ID helpers
export const generateEmployeeId = (): string => {
  const maxId = Math.max(
    ...mockEmployees.map((emp) => parseInt(emp.id.replace("emp-", "")))
  );
  return `emp-${maxId + 1}`;
};

export const generateEmployeeCode = (): string => {
  const maxCode = Math.max(
    ...mockEmployees.map((emp) => parseInt(emp.employeeCode.replace("NV", "")))
  );
  return `NV${String(maxCode + 1).padStart(3, "0")}`;
};

export const generateDepartmentId = (): string => {
  const maxId = Math.max(
    ...mockDepartments.map((dept) => parseInt(dept.id.replace("dept-", "")))
  );
  return `dept-${maxId + 1}`;
};

export const generatePositionId = (): string => {
  const maxId = Math.max(
    ...mockPositions.map((pos) => parseInt(pos.id.replace("pos-", "")))
  );
  return `pos-${maxId + 1}`;
};
