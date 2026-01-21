// Authentication & Authorization Types

export type Role = 'admin' | 'hr_manager' | 'crm_manager' | 'sale' | 'hr_staff';

export type Permission =
  // CRM Permissions
  | 'crm:view_all_customers'
  | 'crm:view_own_customers'
  | 'crm:create_customer'
  | 'crm:edit_customer'
  | 'crm:delete_customer'
  | 'crm:transfer_customer'
  | 'crm:view_customer_history'
  // HR Permissions
  | 'hr:view_all_employees'
  | 'hr:view_department_employees'
  | 'hr:create_employee'
  | 'hr:edit_employee'
  | 'hr:delete_employee'
  | 'hr:view_salary'
  | 'hr:view_own_salary'
  | 'hr:edit_salary'
  // Attendance Permissions
  | 'attendance:checkin'
  | 'attendance:checkout'
  | 'attendance:view_own'
  | 'attendance:view_team'
  | 'attendance:view_department'
  | 'attendance:view_all'
  | 'attendance:approve'
  | 'attendance:edit'
  // Admin Permissions
  | 'admin:view_audit_log'
  | 'admin:manage_users'
  | 'admin:manage_roles'
  | 'admin:view_all_data';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: Role;
  departmentId?: string;
  teamId?: string;
  permissions: Permission[];
  isActive: boolean;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
}

export interface RolePermissions {
  role: Role;
  permissions: Permission[];
  description: string;
}
