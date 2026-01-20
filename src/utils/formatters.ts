import dayjs from "dayjs";

/**
 * Format currency in Vietnamese Dong
 * @param value - The number to format
 * @returns Formatted string (e.g., "25,000,000 ₫")
 */
export const formatCurrency = (value: number): string => {
  return `${value.toLocaleString("vi-VN")} ₫`;
};

/**
 * Format date to Vietnamese format
 * @param date - Date string or Date object
 * @param format - dayjs format string (default: "DD/MM/YYYY")
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date,
  format: string = "DD/MM/YYYY"
): string => {
  return dayjs(date).format(format);
};

/**
 * Format date to long Vietnamese format
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., "15 tháng 5, 2020")
 */
export const formatDateLong = (date: string | Date): string => {
  return dayjs(date).format("DD [tháng] M, YYYY");
};

/**
 * Format phone number to Vietnamese format
 * @param phone - Phone number string
 * @returns Formatted phone string (e.g., "090 123 4567")
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return "";
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  
  // Format: 0XX XXX XXXX
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  // Format: 0XX XXXX XXXX
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

/**
 * Calculate age from date of birth
 * @param dateOfBirth - Date of birth string
 * @returns Age in years
 */
export const calculateAge = (dateOfBirth: string): number => {
  return dayjs().diff(dayjs(dateOfBirth), "year");
};

/**
 * Get status badge color based on employee status
 * @param status - Employee status
 * @returns Ant Design badge status
 */
export const getStatusColor = (
  status: "active" | "inactive" | "resigned"
): "success" | "warning" | "error" => {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "warning";
    case "resigned":
      return "error";
    default:
      return "success";
  }
};

/**
 * Get status text in Vietnamese
 * @param status - Employee status
 * @returns Vietnamese status text
 */
export const getStatusText = (
  status: "active" | "inactive" | "resigned"
): string => {
  switch (status) {
    case "active":
      return "Đang làm việc";
    case "inactive":
      return "Tạm nghỉ";
    case "resigned":
      return "Đã nghỉ việc";
    default:
      return status;
  }
};

/**
 * Get gender text in Vietnamese
 * @param gender - Gender value
 * @returns Vietnamese gender text
 */
export const getGenderText = (gender: "male" | "female" | "other"): string => {
  switch (gender) {
    case "male":
      return "Nam";
    case "female":
      return "Nữ";
    case "other":
      return "Khác";
    default:
      return gender;
  }
};

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Parse currency string to number
 * @param currencyString - Currency string (e.g., "25,000,000 ₫")
 * @returns Number value
 */
export const parseCurrency = (currencyString: string): number => {
  return parseInt(currencyString.replace(/[^\d]/g, "")) || 0;
};
