import { FC } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { navConfig } from '../core/components';
import { ShopRoutes } from '../shop/routing';
import { CartRoutes } from '../cart/routing';

// const ShopRoutes = lazy(() =>
//   import('features/shop/routing').then(module => ({ default: module.ShopRoutes }))
// );

export const AppRoutes: FC = () => (
  <>
    <Route exact path='/' render={() => <Redirect to={navConfig.shop.path} />} />
    <Route path={navConfig.shop.path} component={ShopRoutes} />
    <Route path={navConfig.cart.path} component={CartRoutes} />
  </>
);
