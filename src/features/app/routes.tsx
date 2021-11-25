import { FC, lazy } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';

import { appModulesVar } from 'config';
import { CartRoutes } from '../cart/routing';
import { UserRoutes } from '../user/routing';

const ShopRoutes = lazy(() =>
  import('features/shop/routing').then(module => ({ default: module.ShopRoutes }))
);

const CardRoutes = lazy(() =>
  import('features/card/routing').then(module => ({ default: module.CardRoutes }))
);

export const AppRoutes: FC = () => {
  const appModules: any = useReactiveVar(appModulesVar);

  return (
    <>
      <Route exact path='/' render={() => <Redirect to={appModules.shop.path} />} />
      <Route exact path='/sign-in' render={() => <Redirect to={appModules.user.path} />} />
      <Route exact path='/sign-up' render={() => <Redirect to={appModules.user.path} />} />
      <Route path={appModules.shop.path} component={ShopRoutes} />
      <Route path={appModules.cart.path} component={CartRoutes} />
      <Route path={appModules.user.path} component={UserRoutes} />
      <Route path={appModules.card.path} component={CardRoutes} />
    </>
  );
};
