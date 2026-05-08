// src/layouts/TopNavBar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { PATHS } from '../utils/pathUtils';

const TopNavBar: React.FC = () => {
  const navItems = [
    { path: PATHS.KY_THUAT.LAP_KE_HOACH, label: 'Lập kế hoạch', icon: 'edit_document' },
    { path: PATHS.QUAN_LY.DASHBOARD, label: 'Phê duyệt kế hoạch', icon: 'checklist' },
    { path: PATHS.KY_THUAT.DASHBOARD, label: 'Theo dõi kế hoạch', icon: 'work' },
    { path: PATHS.QUAN_LY.THONG_KE, label: 'Báo cáo thống kê', icon: 'pie_chart' },
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