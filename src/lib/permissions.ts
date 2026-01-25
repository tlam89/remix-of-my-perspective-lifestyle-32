// ============================================================================
// ROLES & PERMISSIONS DEFINITIONS
// ============================================================================

export type Role = 'admin' | 'editor' | 'viewer';

export type Permission =
  // Dashboard
  | 'dashboard.access'
  // Application Forms
  | 'application.view'
  | 'application.edit'
  | 'application.verify'   // Admin only - verify content
  | 'application.approve'  // Admin only - approve to editor
  // Evaluation Tab
  | 'evaluation.view'      // Admin & Editor only
  // Chat Assistant
  | 'chat.view'            // View assistant comments
  | 'chat.interact'        // Full interaction with chatbot
  // Curriculum
  | 'curriculum.view'
  | 'curriculum.edit'
  | 'curriculum.delete'
  // Admin Panel
  | 'admin.access'
  | 'admin.users'
  | 'admin.settings'
  // General
  | 'reports.view'
  | 'reports.create'
  | 'reports.edit';

// Role to permissions mapping
// Viewer: Can EDIT applications, NO chatbot, NO verify button, NO evaluation tab
// Editor: Can VIEW applications (read-only), sees assistant comments, NO verify button, CAN see evaluation tab
// Admin: Can VIEW applications, CAN verify, CAN approve to editor, full access
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'dashboard.access',
    'application.view',
    'application.verify',
    'application.approve',
    'evaluation.view',
    'chat.view',
    'chat.interact',
    'curriculum.view',
    'curriculum.edit',
    'curriculum.delete',
    'admin.access',
    'admin.users',
    'admin.settings',
    'reports.view',
    'reports.create',
    'reports.edit',
  ],
  editor: [
    'dashboard.access',
    'application.view',      // View only, no edit
    'evaluation.view',       // Can see evaluation tab
    'chat.view',             // Can see assistant comments (read-only)
    'curriculum.view',
    'curriculum.edit',
    'reports.view',
    'reports.create',
    'reports.edit',
  ],
  viewer: [
    'dashboard.access',
    'application.view',
    'application.edit',      // Viewer can EDIT applications
    'curriculum.view',
    'reports.view',
    // NO chat.view - cannot see chatbot
    // NO evaluation.view - cannot see evaluation tab
    // NO application.verify - cannot verify
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
