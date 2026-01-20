// Status options
export const STATUS_OPTIONS = [
  { label: "Đang làm việc", value: "active" },
  { label: "Tạm nghỉ", value: "inactive" },
  { label: "Đã nghỉ việc", value: "resigned" },
];

// Gender options
export const GENDER_OPTIONS = [
  { label: "Nam", value: "male" },
  { label: "Nữ", value: "female" },
  { label: "Khác", value: "other" },
];

// Pagination options
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Default page size
export const DEFAULT_PAGE_SIZE = 10;

// Salary constants
export const MIN_SALARY = 5000000;

// Age constants
export const MIN_AGE = 18;
export const MAX_AGE = 65;

// Date format constants
export const DATE_FORMAT = "DD/MM/YYYY";
export const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm:ss";
export const DATE_FORMAT_API = "YYYY-MM-DD";

// Table constants
export const TABLE_SCROLL_Y = 600;

// Notification duration (seconds)
export const NOTIFICATION_DURATION = 3;

// Debounce delay (milliseconds)
export const SEARCH_DEBOUNCE_DELAY = 300;

// Form layout
export const FORM_LAYOUT = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export const FORM_LAYOUT_FULL = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

// Modal width
export const MODAL_WIDTH = 800;
export const MODAL_WIDTH_SMALL = 500;

// Avatar size
export const AVATAR_SIZE = 96;
export const AVATAR_SIZE_SMALL = 48;
export const AVATAR_SIZE_LIST = 40;

// Breakpoints
export const BREAKPOINTS = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};
