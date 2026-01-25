import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Permission, Role } from '@/lib/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  requiredRole?: Role;
  requireAll?: boolean; // If true, requires all permissions; if false, requires any
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requiredPermissions = [],
  requiredRole,
  requireAll = false,
  fallbackPath = '/login',
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, hasPermission, hasAnyPermission, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Check single permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Check multiple permissions requirement
  const allPermissions = [...requiredPermissions];
  if (allPermissions.length > 0) {
    const hasAccess = requireAll
      ? allPermissions.every((perm) => hasPermission(perm))
      : hasAnyPermission(allPermissions);

    if (!hasAccess) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
}
