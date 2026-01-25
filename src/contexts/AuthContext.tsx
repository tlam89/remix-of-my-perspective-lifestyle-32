import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authService } from '@/lib/auth-service';
import { Role, Permission, getPermissionsForRoles, hasPermission as checkPermission, hasAnyPermission as checkAnyPermission } from '@/lib/permissions';

// ============================================================================
// TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name?: string;
  roles: Role[];
  permissions: Permission[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasRole: (role: Role) => boolean;
  // Demo mode functions
  setDemoUser: (role: Role) => void;
  clearDemoUser: () => void;
  isDemoMode: boolean;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ============================================================================
// DEMO USERS (for development/testing)
// ============================================================================

const createDemoUser = (role: Role): User => ({
  id: `demo-${role}`,
  email: `${role}@demo.com`,
  name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
  roles: [role],
  permissions: getPermissionsForRoles([role]),
});

// ============================================================================
// PROVIDER
// ============================================================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      // Check for demo user in localStorage first
      const demoRole = localStorage.getItem('demo-user-role') as Role | null;
      if (demoRole && ['admin', 'editor', 'viewer'].includes(demoRole)) {
        setUser(createDemoUser(demoRole));
        setIsDemoMode(true);
        setLoading(false);
        return;
      }

      // Try to refresh real session
      const result = await authService.refreshSession();
      if (result.success && result.user) {
        const userWithPermissions: User = {
          ...result.user,
          permissions: getPermissionsForRoles(result.user.roles || ['viewer']),
        };
        setUser(userWithPermissions);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (result.success && result.user) {
      const userWithPermissions: User = {
        ...result.user,
        permissions: getPermissionsForRoles(result.user.roles || ['viewer']),
      };
      setUser(userWithPermissions);
      setIsDemoMode(false);
      localStorage.removeItem('demo-user-role');
      return { success: true };
    }
    return { success: false, error: result.error || 'Login failed' };
  }, []);

  const logout = useCallback(async () => {
    if (!isDemoMode) {
      await authService.logout();
    }
    setUser(null);
    setIsDemoMode(false);
    localStorage.removeItem('demo-user-role');
  }, [isDemoMode]);

  const setDemoUser = useCallback((role: Role) => {
    const demoUser = createDemoUser(role);
    setUser(demoUser);
    setIsDemoMode(true);
    localStorage.setItem('demo-user-role', role);
  }, []);

  const clearDemoUser = useCallback(() => {
    setUser(null);
    setIsDemoMode(false);
    localStorage.removeItem('demo-user-role');
  }, []);

  const hasPermission = useCallback((permission: Permission) => {
    if (!user) return false;
    return checkPermission(user.roles, permission);
  }, [user]);

  const hasAnyPermission = useCallback((permissions: Permission[]) => {
    if (!user) return false;
    return checkAnyPermission(user.roles, permissions);
  }, [user]);

  const hasRole = useCallback((role: Role) => {
    if (!user) return false;
    return user.roles.includes(role);
  }, [user]);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasRole,
    setDemoUser,
    clearDemoUser,
    isDemoMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
