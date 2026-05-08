import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storage } from '../utils/storageUtils';
import { authService } from '../services/authService';
import { PATHS } from '../utils/pathUtils';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const user = storage.getUser();
  const isAuthenticated = !!storage.getToken();

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = PATHS.AUTH.LOGIN;
  };

  return (
    <header className="header">
      {/* Logo Section */}
      <div className="header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <div className="header-logo-icon">
          <span className="material-symbols-outlined">nature_people</span>
        </div>
        <span className="header-logo-text">GreenLife Da Nang</span>
      </div>

      {/* Central Search Bar */}
      <div className="header-search">
        <div className="header-search-wrapper">
          <span className="material-symbols-outlined header-search-icon">search</span>
          <input
            className="header-search-input"
            placeholder="Tìm kiếm nhanh..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Right Actions Section */}
      <div className="header-actions">
        {isAuthenticated ? (
          <>
            <button className="header-action-btn" title="Thông báo">
              <span className="material-symbols-outlined">notifications</span>
              <span className="header-notification-dot"></span>
            </button>

            <button className="header-action-btn" title="Trợ giúp">
              <span className="material-symbols-outlined">help</span>
            </button>

            <div 
              className="header-user-wrapper" 
              ref={dropdownRef}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div 
                className={`header-user ${isDropdownOpen ? 'active' : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="header-user-info">
                  <p className="header-user-name">{user?.hoTen || 'Người dùng'}</p>
                  <p className="header-user-role">{user?.roleName || 'Thành viên'}</p>
                </div>
                <img
                  alt="Avatar"
                  className="header-user-avatar"
                  src={user?.anhDaiDien ? `/avatars/${user.anhDaiDien}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.hoTen || 'U')}&background=059669&color=fff`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.hoTen || 'U')}&background=059669&color=fff`;
                  }}
                />
                <span className="material-symbols-outlined header-user-arrow">expand_more</span>
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="header-dropdown animate-fade-in">
                  <div className="dropdown-header">
                    <img 
                      className="dropdown-avatar" 
                      src={user?.anhDaiDien ? `/avatars/${user.anhDaiDien}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.hoTen || 'U')}&background=059669&color=fff`}
                      alt="Avatar"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.hoTen || 'U')}&background=059669&color=fff`;
                      }}
                    />
                    <div className="dropdown-info">
                      <p className="dropdown-user-name">{user?.hoTen}</p>
                      <p className="dropdown-user-role">{user?.roleName}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to={PATHS.AUTH.PROFILE} className="dropdown-item">
                    <span className="material-symbols-outlined">person</span>
                    Trang cá nhân
                  </Link>
                  <Link to={PATHS.AUTH.SETTINGS} className="dropdown-item">
                    <span className="material-symbols-outlined">settings</span>
                    Cài đặt
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <span className="material-symbols-outlined">logout</span>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="header-guest-actions">
            <Link to={PATHS.AUTH.LOGIN} className="header-btn secondary">Đăng nhập</Link>
            <Link to={PATHS.AUTH.REGISTER} className="header-btn primary">Đăng ký</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;