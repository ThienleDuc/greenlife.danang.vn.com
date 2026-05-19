import { ROLE_CODES } from './roleUtils';
import type { RoleCode } from './roleUtils';
import { PATHS } from './pathUtils';

export interface NavItem {
  path: string;
  label: string;
  icon: string;
}

/**
 * Định nghĩa tất cả các mục menu khả dụng
 */
export const NAV_ITEMS = {
  LAP_KE_HOACH: { 
    path: PATHS.KY_THUAT.LAP_KE_HOACH, 
    label: 'Lập kế hoạch',
    icon: 'edit_document' 
  },
  THEO_DOI_KE_HOACH: { 
    path: PATHS.KY_THUAT.DASHBOARD, 
    label: 'Theo dõi kế hoạch', 
    icon: 'work' 
  },
  THONG_KE: { 
    path: PATHS.QUAN_LY.THONG_KE, 
    label: 'Báo cáo thống kê', 
    icon: 'pie_chart' 
  },
  USER_MANAGEMENT: { 
    path: PATHS.ADMIN.USER_MANAGEMENT, 
    label: 'Quản lý người dùng', 
    icon: 'group' 
  },
  DASHBOARD_ADMIN: { 
    path: PATHS.ADMIN.DASHBOARD, 
    label: 'Tổng quan hệ thống', 
    icon: 'dashboard' 
  }
} as const;

/**
 * Phân quyền hiển thị menu theo vai trò
 */
export const ROLE_NAV_ITEMS: Record<RoleCode, NavItem[]> = {
  [ROLE_CODES.ADMIN]: [
    NAV_ITEMS.DASHBOARD_ADMIN,
    NAV_ITEMS.USER_MANAGEMENT,
    NAV_ITEMS.THEO_DOI_KE_HOACH,
  ],
  [ROLE_CODES.KY_THUAT]: [
    NAV_ITEMS.THEO_DOI_KE_HOACH,
    NAV_ITEMS.LAP_KE_HOACH,
  ],
  [ROLE_CODES.QUAN_LY]: [
    NAV_ITEMS.THEO_DOI_KE_HOACH,
    NAV_ITEMS.THONG_KE,
  ],
  [ROLE_CODES.CONG_NHAN]: [
    { path: PATHS.CONG_NHAN.DASHBOARD, label: 'Công việc của tôi', icon: 'assignment_ind' },
  ],
  [ROLE_CODES.NGUOI_DAN]: [
    { path: '/trang-chu', label: 'Trang chủ', icon: 'home' },
    { path: '/phan-anh-su-co', label: 'Phản ánh sự cố', icon: 'campaign' },
  ],
};

/**
 * Lấy danh sách menu dựa trên vai trò
 */
export const getNavItemsByRole = (role: RoleCode | undefined): NavItem[] => {
  if (!role) return [];
  return ROLE_NAV_ITEMS[role] || [];
};
