const authService = require('../services/auth.service');
const { loginSchema, registerSchema } = require('../validations/authValidation');

const login = async (req, res) => {
  try {
    // 1. Validation
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { identifier, matKhau } = req.body;

    // 2. Business Logic via Service
    const result = await authService.login(identifier, matKhau);

    // 3. Response
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const register = async (req, res) => {
  try {
    // 1. Validation
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // 2. Business Logic via Service
    const newUser = await authService.register(req.body);

    // 3. Response
    res.status(201).json({
      message: 'Đăng ký thành công',
      user: {
        maNguoiDung: newUser.MaNguoiDung,
        tenDangNhap: newUser.TenDangNhap
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  login,
  register
};
