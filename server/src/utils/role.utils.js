/**
 * Các mã vai trò (MaVaiTro) định nghĩa trong hệ thống
 */
const ROLE_CODES = {
  ADMIN: 'QTHT',         // Quản trị hệ thống
  QUAN_LY: 'CBQL',       // Cán bộ quản lý
  KY_THUAT: 'NVKT',      // Nhân viên kỹ thuật
  CONG_NHAN: 'CNCX',     // Công nhân cây xanh
  NGUOI_DAN: 'ND'        // Người dân
};

/**
 * Kiểm tra xem người dùng có phải là Admin hay không
 * @param {Object} user - Đối tượng người dùng từ JWT payload
 * @returns {boolean}
 */
const isAdmin = (user) => {
  return user && user.role === ROLE_CODES.ADMIN;
};

/**
 * Kiểm tra xem người dùng có phải là Nhân viên kỹ thuật hay không
 * @param {Object} user - Đối tượng người dùng từ JWT payload
 * @returns {boolean}
 */
const isKyThuat = (user) => {
  return user && user.role === ROLE_CODES.KY_THUAT;
};

/**
 * Kiểm tra xem người dùng có phải là Công nhân hay không
 * @param {Object} user - Đối tượng người dùng từ JWT payload
 * @returns {boolean}
 */
const isCongNhan = (user) => {
  return user && user.role === ROLE_CODES.CONG_NHAN;
};

/**
 * Kiểm tra xem người dùng có phải là Lãnh đạo/Quản lý hay không
 * @param {Object} user - Đối tượng người dùng từ JWT payload
 * @returns {boolean}
 */
const isQuanLy = (user) => {
  return user && user.role === ROLE_CODES.QUAN_LY;
};

/**
 * Kiểm tra xem người dùng có phải là Người dân hay không
 * @param {Object} user - Đối tượng người dùng từ JWT payload
 * @returns {boolean}
 */
const isNguoiDan = (user) => {
  return user && user.role === ROLE_CODES.NGUOI_DAN;
};

/**
 * Kiểm tra xem người dùng có thuộc một trong các vai trò cho phép hay không
 * @param {Object} user - Đối tượng người dùng từ JWT payload
 * @param {Array} allowedRoles - Danh sách các vai trò được phép
 * @returns {boolean}
 */
const hasAnyRole = (user, allowedRoles) => {
  if (!user || !user.role) return false;
  return allowedRoles.includes(user.role);
};

module.exports = {
  ROLE_CODES,
  isAdmin,
  isKyThuat,
  isCongNhan,
  isQuanLy,
  isNguoiDan,
  hasAnyRole
};
