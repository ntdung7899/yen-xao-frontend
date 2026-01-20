import * as yup from "yup";

// Email validation regex (RFC 5322)
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Vietnamese phone regex (10-11 digits, starts with 0)
export const phoneRegex = /^0[0-9]{9,10}$/;

// Employee validation schema
export const employeeSchema = yup.object().shape({
  employeeCode: yup
    .string()
    .required("Mã nhân viên là bắt buộc")
    .matches(/^NV[0-9]{3,}$/, "Mã nhân viên phải có dạng NV001, NV002..."),
  fullName: yup
    .string()
    .required("Họ và tên là bắt buộc")
    .min(3, "Họ và tên phải có ít nhất 3 ký tự")
    .max(100, "Họ và tên không được quá 100 ký tự"),
  dateOfBirth: yup
    .date()
    .required("Ngày sinh là bắt buộc")
    .max(new Date(), "Ngày sinh không thể là ngày trong tương lai")
    .test("age", "Nhân viên phải từ 18 đến 65 tuổi", function (value) {
      if (!value) return false;
      const age = new Date().getFullYear() - value.getFullYear();
      return age >= 18 && age <= 65;
    }),
  gender: yup
    .string()
    .required("Giới tính là bắt buộc")
    .oneOf(["male", "female", "other"], "Giới tính không hợp lệ"),
  email: yup
    .string()
    .required("Email là bắt buộc")
    .matches(emailRegex, "Email không hợp lệ"),
  phone: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(phoneRegex, "Số điện thoại phải có 10-11 số và bắt đầu bằng 0"),
  departmentId: yup.string().required("Phòng ban là bắt buộc"),
  positionId: yup.string().required("Chức vụ là bắt buộc"),
  baseSalary: yup
    .number()
    .required("Lương cơ bản là bắt buộc")
    .min(5000000, "Lương cơ bản phải ít nhất 5,000,000 VND")
    .typeError("Lương cơ bản phải là số"),
  joinDate: yup
    .date()
    .required("Ngày vào làm là bắt buộc")
    .max(new Date(), "Ngày vào làm không thể là ngày trong tương lai"),
  address: yup.string().max(500, "Địa chỉ không được quá 500 ký tự"),
});

// Department validation schema
export const departmentSchema = yup.object().shape({
  code: yup
    .string()
    .required("Mã phòng ban là bắt buộc")
    .max(10, "Mã phòng ban không được quá 10 ký tự")
    .matches(/^[A-Z0-9]+$/, "Mã phòng ban chỉ được chứa chữ in hoa và số"),
  name: yup
    .string()
    .required("Tên phòng ban là bắt buộc")
    .min(3, "Tên phòng ban phải có ít nhất 3 ký tự")
    .max(100, "Tên phòng ban không được quá 100 ký tự"),
  description: yup
    .string()
    .max(500, "Mô tả không được quá 500 ký tự"),
  managerId: yup.string(),
});

// Position validation schema
export const positionSchema = yup.object().shape({
  code: yup
    .string()
    .required("Mã chức vụ là bắt buộc")
    .max(10, "Mã chức vụ không được quá 10 ký tự")
    .matches(/^[A-Z0-9]+$/, "Mã chức vụ chỉ được chứa chữ in hoa và số"),
  name: yup
    .string()
    .required("Tên chức vụ là bắt buộc")
    .min(3, "Tên chức vụ phải có ít nhất 3 ký tự")
    .max(100, "Tên chức vụ không được quá 100 ký tự"),
  level: yup
    .number()
    .required("Cấp bậc là bắt buộc")
    .min(1, "Cấp bậc phải từ 1 đến 7")
    .max(7, "Cấp bậc phải từ 1 đến 7")
    .integer("Cấp bậc phải là số nguyên")
    .typeError("Cấp bậc phải là số"),
  description: yup.string().max(500, "Mô tả không được quá 500 ký tự"),
});

// Custom validation functions
export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return phoneRegex.test(phone);
};

export const validateAge = (dateOfBirth: string | Date): boolean => {
  const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
  return age >= 18 && age <= 65;
};

export const validateSalary = (salary: number): boolean => {
  return salary >= 5000000;
};
