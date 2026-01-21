import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, Permission, AuthState } from '../types/auth.types';
import { mockUsers, TEST_CREDENTIALS, mockAuditLogs } from '../data/mockAuthData';
import { AuditLog } from '../types/audit.types';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Try to restore session from localStorage
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useCallback((username: string, password: string): boolean => {
    // Check credentials
    const credentialEntry = Object.entries(TEST_CREDENTIALS).find(
      ([_, cred]) => cred.username === username && cred.password === password
    );

    if (!credentialEntry) {
      return false;
    }

    // Find user
    const foundUser = mockUsers.find((u) => u.username === username);
    if (!foundUser || !foundUser.isActive) {
      return false;
    }

    // Save to state and localStorage
    setUser(foundUser);
    localStorage.setItem('currentUser', JSON.stringify(foundUser));

    // Log audit
    const auditLog: AuditLog = {
      id: `audit-${Date.now()}`,
      userId: foundUser.id,
      userName: foundUser.fullName,
      userRole: foundUser.role,
      action: 'login',
      entity: 'system',
      description: 'Đăng nhập hệ thống',
      timestamp: new Date().toISOString(),
      success: true,
      ipAddress: '192.168.1.1',
    };
    mockAuditLogs.unshift(auditLog);

    return true;
  }, []);

  const logout = useCallback(() => {
    if (user) {
      // Log audit
      const auditLog: AuditLog = {
        id: `audit-${Date.now()}`,
        userId: user.id,
        userName: user.fullName,
        userRole: user.role,
        action: 'logout',
        entity: 'system',
        description: 'Đăng xuất hệ thống',
        timestamp: new Date().toISOString(),
        success: true,
        ipAddress: '192.168.1.1',
      };
      mockAuditLogs.unshift(auditLog);
    }

    setUser(null);
    localStorage.removeItem('currentUser');
  }, [user]);

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false;
      return user.permissions.includes(permission);
    },
    [user]
  );

  const hasAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      if (!user) return false;
      return permissions.some((p) => user.permissions.includes(p));
    },
    [user]
  );

  const hasAllPermissions = useCallback(
    (permissions: Permission[]): boolean => {
      if (!user) return false;
      return permissions.every((p) => user.permissions.includes(p));
    },
    [user]
  );

  const value: AuthState = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
