const Joi = require('joi');

const loginSchema = Joi.object({
  identifier: Joi.string().required().messages({
    'string.empty': 'Tên đăng nhập hoặc Email không được để trống',
    'any.required': 'Tên đăng nhập hoặc Email là bắt buộc'
  }),
  matKhau: Joi.string().required().messages({
    'string.empty': 'Mật khẩu không được để trống',
    'any.required': 'Mật khẩu là bắt buộc'
  })
});

const registerSchema = Joi.object({
  tenDangNhap: Joi.string().min(3).max(17).required(),
  matKhau: Joi.string().min(6).required(),
  hoTen: Joi.string().required(),
  email: Joi.string().email().required(),
  sdt: Joi.string().pattern(/^[0-9]{10}$/).required(),
  maVaiTro: Joi.string().required()
});

module.exports = {
  loginSchema,
  registerSchema
};
