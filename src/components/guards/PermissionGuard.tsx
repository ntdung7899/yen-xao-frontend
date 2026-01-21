import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Permission } from '../../types/auth.types';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  hideIfNoAccess?: boolean; // true = ẩn hoàn toàn, false = hiển thị fallback
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermissions = [],
  requireAll = false,
  fallback = null,
  hideIfNoAccess = true,
}) => {
  const { hasAnyPermission, hasAllPermissions } = useAuth();

  if (requiredPermissions.length === 0) {
    return <>{children}</>;
  }

  const hasAccess = requireAll
    ? hasAllPermissions(requiredPermissions)
    : hasAnyPermission(requiredPermissions);

  if (!hasAccess) {
    return hideIfNoAccess ? null : <>{fallback}</>;
  }

  return <>{children}</>;
};

// Hook version để dùng trong logic
export const usePermission = () => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  const checkPermission = (permission: Permission): boolean => {
    return hasPermission(permission);
  };

  const checkAnyPermission = (permissions: Permission[]): boolean => {
    return hasAnyPermission(permissions);
  };

  const checkAllPermissions = (permissions: Permission[]): boolean => {
    return hasAllPermissions(permissions);
  };

  return {
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
  };
};
