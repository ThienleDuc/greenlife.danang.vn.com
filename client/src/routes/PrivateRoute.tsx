import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  isAuthenticated = true 
}) => {
  // Nếu không truyền prop, tự kiểm tra từ storage
  const isAuth = isAuthenticated !== undefined ? isAuthenticated : !!storage.getToken();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;