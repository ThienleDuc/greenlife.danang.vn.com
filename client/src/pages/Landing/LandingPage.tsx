import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../utils/pathUtils';
import '../../styles/pages/LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // URL của ảnh đã generate (lấy từ thông tin tool trước đó)
  const heroImageUrl = "/green_danang_hero_1778247576703.png";

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section 
        className="hero-section" 
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Kiến tạo đô thị xanh <br />Thông minh & Bền vững</h1>
          <p className="hero-subtitle">
            Hệ thống quản lý cây xanh hiện đại tại Đà Nẵng. Chúng tôi kết hợp công nghệ IoT 
            và dữ liệu thời gian thực để bảo vệ lá phổi xanh của thành phố.
          </p>
          <div className="hero-actions">
            <button 
              className="header-btn primary" 
              onClick={() => navigate(PATHS.AUTH.LOGIN)}
              style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
            >
              Bắt đầu ngay
            </button>
            <button 
              className="header-btn secondary"
              style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'white' }}
            >
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-tag">Tính năng nổi bật</span>
          <h2 className="section-title">Giải pháp quản lý thông minh</h2>
          <p className="feature-desc">Ứng dụng công nghệ tiên tiến giúp tối ưu hóa quy trình chăm sóc và bảo trì hệ thống cây xanh đô thị.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <span className="material-symbols-outlined">monitoring</span>
            </div>
            <h3 className="feature-title">Giám sát thời gian thực</h3>
            <p className="feature-desc">Theo dõi tình trạng sức khỏe, độ ẩm và môi trường của từng cá thể cây xanh thông qua cảm biến IoT.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span className="material-symbols-outlined">calendar_month</span>
            </div>
            <h3 className="feature-title">Lập kế hoạch tự động</h3>
            <p className="feature-desc">Hệ thống tự động đề xuất lịch trình chăm sóc, cắt tỉa dựa trên dữ liệu tăng trưởng và dự báo thời tiết.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span className="material-symbols-outlined">report_problem</span>
            </div>
            <h3 className="feature-title">Phản hồi sự cố nhanh</h3>
            <p className="feature-desc">Kênh tương tác trực tiếp giúp người dân phản ánh nhanh các sự cố gãy đổ, sâu bệnh đến cơ quan quản lý.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">500k+</div>
            <div className="stat-label">Cây xanh quản lý</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">12+</div>
            <div className="stat-label">Quận huyện phủ sóng</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">24/7</div>
            <div className="stat-label">Giám sát liên tục</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">98%</div>
            <div className="stat-label">Tỷ lệ hài lòng</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="cta-title">Sẵn sàng vì một Đà Nẵng xanh?</h2>
        <p className="cta-desc">Hãy tham gia cùng chúng tôi để quản lý và bảo tồn không gian xanh của thành phố một cách hiệu quả hơn.</p>
        <button 
          className="header-btn secondary" 
          onClick={() => navigate(PATHS.AUTH.REGISTER)}
          style={{ padding: '1rem 3rem', fontSize: '1.25rem', background: 'white', color: '#059669', fontWeight: 'bold' }}
        >
          Đăng ký tham gia ngay
        </button>
      </section>
    </div>
  );
};

export default LandingPage;
