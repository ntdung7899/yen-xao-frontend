import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Permission } from '../../types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  requireAll?: boolean; // true = cần tất cả permissions, false = chỉ cần 1 permission
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requireAll = false,
}) => {
  const { isAuthenticated, hasAnyPermission, hasAllPermissions } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // TODO: Uncomment to enable permission check
  // if (requiredPermissions.length > 0) {
  //   const hasAccess = requireAll
  //     ? hasAllPermissions(requiredPermissions)
  //     : hasAnyPermission(requiredPermissions);

  //   if (!hasAccess) {
  //     return <Navigate to="/access-denied" replace />;
  //   }
  // }

  return <>{children}</>;
};
