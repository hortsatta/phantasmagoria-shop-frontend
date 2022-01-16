import { rbacRules } from 'config/rbac';

export const validateRole = (role: string, actions: string[]): boolean => {
  const permissions = rbacRules[role];

  // Prevent if current role does not exist in the rule.
  if (!permissions) {
    return false;
  }

  const { static: staticPermissions } = permissions;

  if (staticPermissions) {
    const filteredStaticPermissions = staticPermissions.filter((permission: string) =>
      actions.includes(permission)
    );

    if (filteredStaticPermissions.length) {
      return true;
    }
  }

  return false;
};
