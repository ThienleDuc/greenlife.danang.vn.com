import React from 'react';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  isAuthenticated = false 
}) => {
  if (isAuthenticated) {
    return <Navigate to="/ke-hoach-cong-viec" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;