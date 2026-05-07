const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const jwtUtils = require('../utils/jwt.utils');

const login = async (identifier, matKhau) => {
  const user = await userRepository.findByUsernameOrEmail(identifier);
  if (!user) {
    throw new Error('Tên đăng nhập/Email hoặc mật khẩu không chính xác');
  }

  const isMatch = await bcrypt.compare(matKhau, user.MatKhauHash);
  if (!isMatch) {
    throw new Error('Tên đăng nhập/Email hoặc mật khẩu không chính xác');
  }

  const token = jwtUtils.generateToken({ 
    id: user.MaNguoiDung, 
    username: user.TenDangNhap, 
    role: user.MaVaiTro,
    roleName: user.TenVaiTro
  });

  return {
    user: {
      maNguoiDung: user.MaNguoiDung,
      tenDangNhap: user.TenDangNhap,
      hoTen: user.HoTen,
      role: user.MaVaiTro,
      roleName: user.TenVaiTro
    },
    token
  };
};

const register = async (userData) => {
  const existingUser = await userRepository.findByUsername(userData.tenDangNhap);
  if (existingUser) {
    throw new Error('Tên đăng nhập đã tồn tại');
  }

  const salt = await bcrypt.genSalt(10);
  const matKhauHash = await bcrypt.hash(userData.matKhau, salt);

  // Sinh MaNguoiDung ngẫu nhiên (ví dụ ND001, ND002...)
  // Thực tế nên có logic sinh mã chuyên nghiệp hơn
  const maNguoiDung = 'ND' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

  const newUser = await userRepository.createUser({
    ...userData,
    maNguoiDung,
    matKhauHash
  });

  return newUser;
};

module.exports = {
  login,
  register
};
