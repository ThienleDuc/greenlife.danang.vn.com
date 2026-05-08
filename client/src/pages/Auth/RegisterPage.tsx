import React, { useState } from "react";
import { Link } from "react-router-dom";
import loginBg from "../../assets/login-bg.png";
import authService from "../../services/authService";
import { ROLE_CODES } from "../../utils/roleUtils";

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    tenDangNhap: "",
    matKhau: "",
    hoTen: "",
    email: "",
    sdt: "",
    maVaiTro: ROLE_CODES.NGUOI_DAN as string,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    try {
      await authService.register(formData);
      setSuccessMsg("Đăng ký tài khoản thành công! Đang chuyển hướng đến trang đăng nhập...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err: any) {
      const message = err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="login-page register-page"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* Overlay */}
      <div className="login-overlay"></div>

      {/* Decorative elements */}
      <div className="decorative-text top-left">JOIN</div>
      <div className="decorative-text bottom-right">US</div>

      {/* Register Card */}
      <div className="login-card-wrapper register-card-wrapper">
        <div className="login-glass-card register-glass-card">
          
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="login-logo-container">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="login-logo-icon" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="login-title">Tham gia GreenLife</h1>
            <p className="login-subtitle">Tạo tài khoản để quản lý cây xanh Đà Nẵng</p>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center animate-shake">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-sm text-center">
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Tên đăng nhập</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="tenDangNhap"
                    value={formData.tenDangNhap}
                    onChange={handleChange}
                    className="login-input"
                    placeholder="john_doe"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="matKhau"
                    value={formData.matKhau}
                    onChange={handleChange}
                    className="login-input pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Họ và tên</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="hoTen"
                  value={formData.hoTen}
                  onChange={handleChange}
                  className="login-input"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="login-input"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <div className="input-wrapper">
                  <input
                    type="tel"
                    name="sdt"
                    value={formData.sdt}
                    onChange={handleChange}
                    className="login-input"
                    placeholder="0123456789"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Vai trò (Giả lập chọn vai trò)</label>
              <div className="input-wrapper">
                <select
                  name="maVaiTro"
                  value={formData.maVaiTro}
                  onChange={handleChange}
                  className="login-input role-select"
                >
                  <option value={ROLE_CODES.NGUOI_DAN}>Người dân</option>
                  <option value={ROLE_CODES.KY_THUAT}>Nhân viên kỹ thuật</option>
                  <option value={ROLE_CODES.QUAN_LY}>Cán bộ quản lý</option>
                  <option value={ROLE_CODES.CONG_NHAN}>Công nhân cây xanh</option>
                  <option value={ROLE_CODES.ADMIN}>Quản trị hệ thống</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="login-button"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <span>Đăng ký tài khoản</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p className="login-footer-text">
              Đã có tài khoản?{" "}
              <Link to="/login" className="login-footer-link font-bold">Đăng nhập ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
