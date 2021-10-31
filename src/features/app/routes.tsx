import { FC, lazy } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { navConfig } from 'features/core/components';

const ShopRoutes = lazy(() =>
  import('features/shop/routing').then(module => ({ default: module.ShopRoutes }))
);

export const AppRoutes: FC = () => (
  <>
    <Route exact path='/' render={() => <Redirect to={navConfig.shop.path} />} />
    <Route path={navConfig.shop.path} component={ShopRoutes} />
  </>
);
