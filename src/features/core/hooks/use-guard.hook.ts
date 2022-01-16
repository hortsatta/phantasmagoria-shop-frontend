import { useCallback } from 'react';
import { useReactiveVar } from '@apollo/client';

import { validateRole } from 'helpers';
import { currentUserAccountVar } from 'config';

type Result = {
  canActivate: (actions: string[]) => boolean;
};

export const useGuard = (): Result => {
  const currentUserRole = useReactiveVar(currentUserAccountVar);

  const canActivate = useCallback(
    (actions: string[]): boolean => validateRole(currentUserRole?.user.role.id || '0', actions),
    [currentUserRole]
  );

  return { canActivate };
};
