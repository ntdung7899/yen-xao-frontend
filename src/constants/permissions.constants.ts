import { Permission } from "../types/auth.types";

export const PERMISSION_LABELS: Record<Permission, string> = {
    // CRM Permissions
    "crm:view_all_customers": "Xem tất cả khách hàng",
    "crm:view_own_customers": "Xem khách hàng phụ trách",
    "crm:view_team_customers": "Xem khách hàng đội nhóm",
    "crm:create_customer": "Thêm khách hàng mới",
    "crm:edit_customer": "Chỉnh sửa khách hàng",
    "crm:delete_customer": "Xóa khách hàng",
    "crm:transfer_customer": "Điều chuyển khách hàng",
    "crm:view_customer_history": "Xem lịch sử chăm sóc",

    // HR Permissions
    "hr:view_all_employees": "Xem tất cả nhân viên",
    "hr:view_department_employees": "Xem nhân viên phòng ban",
    "hr:view_team_employees": "Xem nhân viên đội nhóm",
    "hr:create_employee": "Thêm nhân viên mới",
    "hr:edit_employee": "Chỉnh sửa nhân viên",
    "hr:delete_employee": "Xóa nhân viên",
    "hr:view_salary": "Xem thông tin lương",
    "hr:view_own_salary": "Xem lương cá nhân",
    "hr:edit_salary": "Điều chỉnh lương",

    // Attendance Permissions
    "attendance:checkin": "Chấm công vào",
    "attendance:checkout": "Chấm công ra",
    "attendance:view_own": "Xem công cá nhân",
    "attendance:view_team": "Xem công đội nhóm",
    "attendance:view_department": "Xem công phòng ban",
    "attendance:view_all": "Xem công toàn công ty",
    "attendance:approve": "Duyệt đơn nghỉ/công",
    "attendance:edit": "Chỉnh sửa dữ liệu công",

    // Admin Permissions
    "admin:view_audit_log": "Xem nhật ký hệ thống",
    "admin:manage_users": "Quản lý người dùng",
    "admin:manage_roles": "Quản lý phân quyền",
    "admin:view_all_data": "Truy cập toàn bộ dữ liệu",
};
