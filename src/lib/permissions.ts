// ============================================================================
// ROLES & PERMISSIONS DEFINITIONS
// ============================================================================

export type Role = 'admin' | 'editor' | 'viewer';

export type Permission =
  // Dashboard
  | 'dashboard.access'
  // Curriculum
  | 'curriculum.view'
  | 'curriculum.edit'
  | 'curriculum.delete'
  // Chat Assistant
  | 'chat.access'
  | 'chat.full'
  // Admin Panel
  | 'admin.access'
  | 'admin.users'
  | 'admin.settings'
  // General
  | 'reports.view'
  | 'reports.create'
  | 'reports.edit';

// Role to permissions mapping
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'dashboard.access',
    'curriculum.view',
    'curriculum.edit',
    'curriculum.delete',
    'chat.access',
    'chat.full',
    'admin.access',
    'admin.users',
    'admin.settings',
    'reports.view',
    'reports.create',
    'reports.edit',
  ],
  editor: [
    'dashboard.access',
    'curriculum.view',
    'curriculum.edit',
    'chat.access',
    'chat.full',
    'reports.view',
    'reports.create',
    'reports.edit',
  ],
  viewer: [
    'dashboard.access',
    'curriculum.view',
    'chat.access',
    'reports.view',
  ],
};

// Get permissions for a role
export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// Get all permissions for multiple roles
export function getPermissionsForRoles(roles: Role[]): Permission[] {
  const permissions = new Set<Permission>();
  roles.forEach((role) => {
    getPermissionsForRole(role).forEach((perm) => permissions.add(perm));
  });
  return Array.from(permissions);
}

// Check if a permission is granted given roles
export function hasPermission(roles: Role[], permission: Permission): boolean {
  return roles.some((role) => ROLE_PERMISSIONS[role]?.includes(permission));
}

// Check if any of the permissions is granted
export function hasAnyPermission(roles: Role[], permissions: Permission[]): boolean {
  return permissions.some((perm) => hasPermission(roles, perm));
}

// Check if all permissions are granted
export function hasAllPermissions(roles: Role[], permissions: Permission[]): boolean {
  return permissions.every((perm) => hasPermission(roles, perm));
}

// Role display names
export const ROLE_DISPLAY_NAMES: Record<Role, string> = {
  admin: 'Quản trị viên',
  editor: 'Biên tập viên',
  viewer: 'Người xem',
};

// Get display name for a role
export function getRoleDisplayName(role: Role): string {
  return ROLE_DISPLAY_NAMES[role] || role;
}
