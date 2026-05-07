const jwt = require('jsonwebtoken');

/**
 * Tạo JWT token từ payload
 * @param {Object} payload - Dữ liệu cần chứa trong token
 * @returns {string} - Token đã được ký
 */
const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
};

/**
 * Xác thực và giải mã JWT token
 * @param {string} token - Token cần xác thực
 * @returns {Object|null} - Payload nếu hợp lệ, ngược lại là null
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
