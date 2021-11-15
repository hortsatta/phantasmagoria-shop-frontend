import { FC, lazy } from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import { navConfig } from 'features/core/components';

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

const authPath = `${navConfig.user.path}${navConfig.user.children?.signIn.path}`;

export const UserRoutes: FC<RouteComponentProps> = ({ match }) => (
  <>
    <Route exact path={match.path} component={UserAccountPage} />
    <Route path={authPath} component={AuthPage} />
  </>
);
