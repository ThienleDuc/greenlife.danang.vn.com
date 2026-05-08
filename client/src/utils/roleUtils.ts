export const ROLE_CODES = {
  ADMIN: 'QTHT',         // Quản trị hệ thống
  QUAN_LY: 'CBQL',       // Cán bộ quản lý
  KY_THUAT: 'NVKT',      // Nhân viên kỹ thuật
  CONG_NHAN: 'CNCX',     // Công nhân cây xanh
  NGUOI_DAN: 'ND'        // Người dân
} as const;

export type RoleCode = typeof ROLE_CODES[keyof typeof ROLE_CODES];

export interface User {
  maNguoiDung: string;
  tenDangNhap: string;
  hoTen: string;
  role: RoleCode;
  roleName?: string;
}

/**
 * Kiểm tra xem người dùng có phải là Admin hay không
 */
export const isAdmin = (user: User | null) => user?.role === ROLE_CODES.ADMIN;

/**
 * Kiểm tra xem người dùng có phải là Nhân viên kỹ thuật hay không
 */
export const isKyThuat = (user: User | null) => user?.role === ROLE_CODES.KY_THUAT;

/**
 * Kiểm tra xem người dùng có phải là Công nhân hay không
 */
export const isCongNhan = (user: User | null) => user?.role === ROLE_CODES.CONG_NHAN;

/**
 * Kiểm tra xem người dùng có phải là Lãnh đạo/Quản lý hay không
 */
export const isQuanLy = (user: User | null) => user?.role === ROLE_CODES.QUAN_LY;

/**
 * Kiểm tra xem người dùng có phải là Người dân hay không
 */
export const isNguoiDan = (user: User | null) => user?.role === ROLE_CODES.NGUOI_DAN;

/**
 * Kiểm tra xem người dùng có thuộc một trong các vai trò cho phép hay không
 */
export const hasAnyRole = (user: User | null, allowedRoles: RoleCode[]) => {
  if (!user || !user.role) return false;
  return allowedRoles.includes(user.role);
};

/**
 * Lấy thông tin người dùng từ localStorage
 */
export const getUserFromStorage = (): User | null => {
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

/**
 * Lấy đường dẫn trang chủ/dashboard tương ứng với vai trò
 */
export const getDashboardPath = (role: RoleCode | undefined): string => {
  switch (role) {
    case ROLE_CODES.ADMIN:
      return "/admin/dashboard";
    case ROLE_CODES.KY_THUAT:
      return "/theo-doi-ke-hoach";
    case ROLE_CODES.CONG_NHAN:
      return "/cong-viec-cua-toi";
    case ROLE_CODES.QUAN_LY:
      return "/phe-duyet-ke-hoach";
    default:
      return "/theo-doi-ke-hoach";
  }
};
