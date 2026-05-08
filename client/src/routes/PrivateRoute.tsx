import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { storage } from '../utils/storageUtils';
import { hasAnyRole } from '../utils/roleUtils';
import type { RoleCode } from '../utils/roleUtils';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: RoleCode[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const location = useLocation();
  const user = storage.getUser();
  const token = storage.getToken();

  // 1. Kiểm tra đăng nhập
  if (!user || !token) {
    // Lưu lại vị trí hiện tại để quay lại sau khi đăng nhập
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Kiểm tra quyền truy cập (nếu có yêu cầu vai trò cụ thể)
  if (allowedRoles && !hasAnyRole(user, allowedRoles)) {
    // Nếu không có quyền, chuyển đến trang unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;