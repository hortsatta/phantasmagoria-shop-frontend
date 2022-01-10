import { FC } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';

import { appModulesVar } from 'config';
import { AdminRoutes } from '../admin/routing';
import { CartRoutes } from '../cart/routing';
import { FavoriteRoutes } from '../favorite/routing';
import { ShopRoutes } from '../shop/routing';
import { OrderRoutes } from '../order/routing';
import { UserRoutes } from '../user/routing';

export const AppRoutes: FC = () => {
  const appModules: any = useReactiveVar(appModulesVar);

  return (
    <>
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
    </>
  );
};
