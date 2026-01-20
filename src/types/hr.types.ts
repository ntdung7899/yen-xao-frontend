// Employee Types
export interface Employee {
  id: string;
  employeeCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  email: string;
  phone: string;
  departmentId: string;
  positionId: string;
  baseSalary: number;
  status: "active" | "inactive" | "resigned";
  joinDate: string;
  resignDate?: string;
  avatar?: string;
  address?: string;
  workHistory?: WorkHistory[];
}

export interface WorkHistory {
  id: string;
  employeeId: string;
  action: string;
  date: string;
  description: string;
  previousPosition?: string;
  newPosition?: string;
  previousDepartment?: string;
  newDepartment?: string;
}

// Department Types
export interface Department {
  id: string;
  code: string;
  name: string;
  description: string;
  managerId?: string;
  createdAt: string;
}

// Position Types
export interface Position {
  id: string;
  code: string;
  name: string;
  level: number;
  description: string;
}

// Form Types
export interface EmployeeFormData {
  employeeCode: string;
  fullName: string;
  dateOfBirth: Date | string;
  gender: "male" | "female" | "other";
  email: string;
  phone: string;
  departmentId: string;
  positionId: string;
  baseSalary: number;
  joinDate: Date | string;
  address?: string;
  avatar?: string;
}

export interface DepartmentFormData {
  code: string;
  name: string;
  description: string;
  managerId?: string;
}

export interface PositionFormData {
  code: string;
  name: string;
  level: number;
  description: string;
}

// Filter Types
export interface EmployeeFilters {
  search?: string;
  departmentIds?: string[];
  positionIds?: string[];
  status?: ("active" | "inactive" | "resigned")[];
  gender?: ("male" | "female" | "other")[];
}

// Pagination Types
export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
}

// Sort Types
export type SortOrder = "ascend" | "descend" | null;

export interface SortConfig {
  field: string;
  order: SortOrder;
}
