import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserFromStorage, getDashboardPath } from '../utils/roleUtils';

import { storage } from '../utils/storageUtils';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children
}) => {
  const isAuthenticated = !!storage.getToken();
  
  if (isAuthenticated) {
    const user = getUserFromStorage();
    
    const dashboardPath = getDashboardPath(user?.role);
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;