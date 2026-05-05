// src/layouts/Header.tsx
import React, { useState } from 'react';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="header">
      {/* Logo Section */}
      <div className="header-logo">
        <div className="header-logo-icon">
          <span className="material-symbols-outlined">
            nature_people
          </span>
        </div>
        <span className="header-logo-text">
          GreenLife Da Nang
        </span>
      </div>

      {/* Central Search Bar */}
      <div className="header-search">
        <div className="header-search-wrapper">
          <span className="material-symbols-outlined header-search-icon">
            search
          </span>
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
        <button className="header-action-btn">
          <span className="material-symbols-outlined">notifications</span>
          <span className="header-notification-dot"></span>
        </button>

        <button className="header-action-btn">
          <span className="material-symbols-outlined">help</span>
        </button>

        <div className="header-user">
          <div className="header-user-info">
            <p className="header-user-name">Nguyen Van A</p>
            <p className="header-user-role">
              Kỹ thuật viên
            </p>
          </div>
          <img
            alt="User Profile Avatar"
            className="header-user-avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjjA7cX7VoZ3V8ToepPEjJ8ovc9bfh2btS46dAHao9QOUuNnI0qir5hIUglfNLRI_m88cF0JttLEgO5gLoY2m2mxYS5WiM39VpKhTTRMpvtvqwl83ngSLNXkBosc7ovs3gG77Ip6xh2dVj-MheLnQW2REIcqsTgIJvM9e2fF3U6URTd3c0m6X8IHi0BTzw9aN99A1Ajg4dUeeuoG6slUbWe2LmWhbklxwfShq8tURceGGfDDafra3RjvFvtaLiIpDWPBFQLWDyYvg"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;