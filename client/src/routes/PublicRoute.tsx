import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserFromStorage, ROLE_CODES } from '../utils/roleUtils';

interface PublicRouteProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  isAuthenticated = false 
}) => {
  if (isAuthenticated) {
    const user = getUserFromStorage();
    
    // Điều hướng dựa trên vai trò khi đã đăng nhập
    switch (user?.role) {
      case ROLE_CODES.ADMIN:
        return <Navigate to="/admin/dashboard" replace />;
      case ROLE_CODES.KY_THUAT:
        return <Navigate to="/theo-doi-ke-hoach" replace />;
      case ROLE_CODES.CONG_NHAN:
        return <Navigate to="/cong-viec-cua-toi" replace />;
      case ROLE_CODES.QUAN_LY:
        return <Navigate to="/phe-duyet-ke-hoach" replace />;
      default:
        return <Navigate to="/theo-doi-ke-hoach" replace />;
    }
  }

  return <>{children}</>;
};

export default PublicRoute;