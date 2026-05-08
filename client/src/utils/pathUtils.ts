import { ROLE_CODES } from './roleUtils';
import type { RoleCode } from './roleUtils';

/**
 * Định nghĩa danh sách các đường dẫn theo vai trò
 */
export const PATHS = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    UNAUTHORIZED: '/unauthorized',
    FORBIDDEN: '/403',
  },
  // Nhóm kỹ thuật (Nhân viên kỹ thuật)
  KY_THUAT: {
    DASHBOARD: '/theo-doi-ke-hoach',
    LAP_KE_HOACH: '/lap-ke-hoach',
    DANH_MUC: '/danh-muc-cay-trong',
  },
  // Nhóm quản lý (Cán bộ quản lý)
  QUAN_LY: {
    DASHBOARD: '/phe-duyet-ke-hoach',
    THONG_KE: '/thong-ke-bao-cao',
  },
  // Nhóm công nhân (Công nhân cây xanh)
  CONG_NHAN: {
    DASHBOARD: '/cong-viec-cua-toi',
    BAO_CAO_SU_CO: '/bao-cao-su-co',
  },
  // Nhóm Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USER_MANAGEMENT: '/admin/users',
  }
} as const;

/**
 * Bản đồ ánh xạ vai trò đến danh sách các đường dẫn được phép
 */
export const ROLE_ALLOWED_PATHS: Record<RoleCode, string[]> = {
  [ROLE_CODES.ADMIN]: [
    PATHS.ADMIN.DASHBOARD,
    PATHS.ADMIN.USER_MANAGEMENT,
    PATHS.KY_THUAT.DASHBOARD,
    PATHS.QUAN_LY.DASHBOARD,
  ],
  [ROLE_CODES.KY_THUAT]: [
    PATHS.KY_THUAT.DASHBOARD,
    PATHS.KY_THUAT.LAP_KE_HOACH,
    PATHS.KY_THUAT.DANH_MUC,
  ],
  [ROLE_CODES.QUAN_LY]: [
    PATHS.QUAN_LY.DASHBOARD,
    PATHS.QUAN_LY.THONG_KE,
    PATHS.KY_THUAT.DASHBOARD, // Quản lý thường xem được dashboard kỹ thuật
  ],
  [ROLE_CODES.CONG_NHAN]: [
    PATHS.CONG_NHAN.DASHBOARD,
    PATHS.CONG_NHAN.BAO_CAO_SU_CO,
  ],
  [ROLE_CODES.NGUOI_DAN]: [
    '/trang-chu',
    '/phan-anh-su-co',
  ],
};

/**
 * Kiểm tra xem một đường dẫn có thuộc quyền hạn của vai trò hay không
 */
export const isPathAllowed = (role: RoleCode, path: string): boolean => {
  const allowedPaths = ROLE_ALLOWED_PATHS[role];
  if (!allowedPaths) return false;
  
  // Kiểm tra chính xác hoặc bắt đầu bằng (cho các sub-routes)
  return allowedPaths.some(p => path === p || path.startsWith(`${p}/`));
};
