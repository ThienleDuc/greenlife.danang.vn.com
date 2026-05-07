const jwtUtils = require('../utils/jwt.utils');
const roleUtils = require('../utils/role.utils');

/**
 * Middleware xác thực Token và phân quyền
 * @param {Array} allowedRoles - Danh sách mã vai trò được phép truy cập (mặc định trống = chỉ cần login)
 */
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      // 1. Lấy token từ header Authorization: Bearer <token>
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: 'Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn' 
        });
      }

      // 2. Giải mã và kiểm tra token (Sử dụng jwtUtils)
      const decoded = jwtUtils.verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ 
          success: false, 
          message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' 
        });
      }

      // 3. Kiểm tra quyền hạn (Sử dụng roleUtils)
      // Nếu có yêu cầu vai trò cụ thể thì mới kiểm tra
      if (allowedRoles.length > 0) {
        const hasPermission = roleUtils.hasAnyRole(decoded, allowedRoles);
        if (!hasPermission) {
          return res.status(403).json({ 
            success: false, 
            message: 'Tài khoản của bạn không có quyền thực hiện chức năng này' 
          });
        }
      }

      // 4. Lưu thông tin user đã decode vào request để các middleware/controller phía sau sử dụng
      req.user = decoded;
      
      // Hợp lệ -> Đi tiếp
      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi hệ thống khi xác thực quyền truy cập' 
      });
    }
  };
};

module.exports = {
  authorize
};
