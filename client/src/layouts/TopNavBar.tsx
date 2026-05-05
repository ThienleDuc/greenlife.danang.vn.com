// src/layouts/TopNavBar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const TopNavBar: React.FC = () => {
  const navItems = [
    { path: '/lap-ke-hoach', label: 'Lập kế hoạch', icon: 'edit_document' },
    { path: '/phe-duyet-ke-hoach', label: 'Phê duyệt kế hoạch', icon: 'checklist' },
    { path: '/theo-doi-ke-hoach', label: 'Theo dõi kế hoạch', icon: 'work' },
    { path: '/bao-cao-thong-ke', label: 'Báo cáo thống kê', icon: 'pie_chart' },
  ];

  return (
    <nav className="top-nav">
      <div className="top-nav-list">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `top-nav-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="material-symbols-outlined">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default TopNavBar;