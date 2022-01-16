import { FC, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';

import { appModulesVar } from 'config';
import { AdminRoutes } from '../admin/routing';
import { CartRoutes } from '../cart/routing';
import { FavoriteRoutes } from '../favorite/routing';
import { ShopRoutes } from '../shop/routing';
import { OrderRoutes } from '../order/routing';
import { UserRoutes } from '../user/routing';

const AboutPage = lazy(() =>
  import('features/single/about.page').then((module: any) => ({
    default: module.AboutPage
  }))
);

const NotFoundPage = lazy(() =>
  import('features/core/pages/not-found.page').then((module: any) => ({
    default: module.NotFoundPage
  }))
);

export const AppRoutes: FC = () => {
  const appModules: any = useReactiveVar(appModulesVar);

  return (
    <Switch>
      <Route exact path='/' render={() => <Redirect to={appModules.shop.path} />} />
      <Route
        exact
        path={appModules.user.children?.signIn.path}
        render={() => <Redirect to={appModules.user.path} />}
      />
      <Route
        exact
        path={appModules.user.children?.signUp.path}
        render={() => <Redirect to={appModules.user.path} />}
      />
      <Route path={appModules.shop.path} component={ShopRoutes} />
      <Route path={appModules.cart.path} component={CartRoutes} />
      <Route path={appModules.favorite.path} component={FavoriteRoutes} />
      <Route path={appModules.order.path} component={OrderRoutes} />
      <Route path={appModules.user.path} component={UserRoutes} />
      <Route path={appModules.admin.path} component={AdminRoutes} />
      <Route path={appModules.about.path} component={AboutPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
};
