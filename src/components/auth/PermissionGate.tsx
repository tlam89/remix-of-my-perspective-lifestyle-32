import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Permission, Role } from '@/lib/permissions';

interface PermissionGateProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  role?: Role;
  roles?: Role[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

/**
 * PermissionGate - Conditionally render children based on user permissions/roles
 * 
 * Usage:
 * <PermissionGate permission="curriculum.edit">
 *   <EditButton />
 * </PermissionGate>
 * 
 * <PermissionGate permissions={['reports.view', 'reports.edit']} requireAll>
 *   <ReportEditor />
 * </PermissionGate>
 * 
 * <PermissionGate role="admin" fallback={<span>No access</span>}>
 *   <AdminPanel />
 * </PermissionGate>
 */
export function PermissionGate({
  children,
  permission,
  permissions = [],
  role,
  roles = [],
  requireAll = false,
  fallback = null,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasRole, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // Check single role
  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  // Check multiple roles (any match)
  if (roles.length > 0 && !roles.some((r) => hasRole(r))) {
    return <>{fallback}</>;
  }

  // Check single permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Check multiple permissions
  const allPermissions = [...permissions];
  if (allPermissions.length > 0) {
    const hasAccess = requireAll
      ? allPermissions.every((perm) => hasPermission(perm))
      : hasAnyPermission(allPermissions);

    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

/**
 * Hook version for more complex conditional logic
 */
export function usePermissionCheck() {
  const { hasPermission, hasAnyPermission, hasRole, isAuthenticated } = useAuth();

  return {
    isAuthenticated,
    can: hasPermission,
    canAny: hasAnyPermission,
    is: hasRole,
  };
}
