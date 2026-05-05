// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import TopNavBar from './TopNavBar';
import Footer from './Footer';

const MainLayout: React.FC = () => {
  return (
    <div className="main-layout">
      <Header />
      <TopNavBar />
      <main className="main-layout-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;