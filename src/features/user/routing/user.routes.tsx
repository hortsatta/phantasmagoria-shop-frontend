import { FC, lazy, useMemo } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Route, RouteComponentProps } from 'react-router-dom';

import { appModulesVar } from 'config';

const AuthPage = lazy(() =>
  import('features/auth/pages/auth.page').then((module: any) => ({
    default: module.AuthPage
  }))
);

const UserAccountPage = lazy(() =>
  import('../pages/user-account.page').then((module: any) => ({
    default: module.UserAccountPage
  }))
);

export const UserRoutes: FC<RouteComponentProps> = ({ match }) => {
  const appModules: any = useReactiveVar(appModulesVar);
  const authPath = useMemo(
    () => `${appModules.user.path}${appModules.user.children?.signIn.path}`,
    [appModules]
  );

  return (
    <>
      <Route exact path={match.path} component={UserAccountPage} />
      <Route path={authPath} component={AuthPage} />
    </>
  );
};
