// src/layouts/TopNavBar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';


import { storage } from '../utils/storageUtils';
import { getNavItemsByRole } from '../utils/navUtils';

const TopNavBar: React.FC = () => {
  const user = storage.getUser();
  const navItems = getNavItemsByRole(user?.role);

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