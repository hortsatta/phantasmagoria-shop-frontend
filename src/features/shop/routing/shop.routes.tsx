import { navConfig } from 'features/core/components';
import { FC, lazy } from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

const ShopLandingPage = lazy(() =>
  import('../pages/shop-landing.page').then((module: any) => ({
    default: module.ShopLandingPage
  }))
);

const ShopListPage = lazy(() =>
  import('../pages/shop-list.page').then((module: any) => ({
    default: module.ShopListPage
  }))
);

export const ShopRoutes: FC<RouteComponentProps> = ({ match }) => (
  <>
    <Route exact path={match.path} component={ShopListPage} />
    <Route
      path={`${navConfig.shop.path}${navConfig.shop.children?.landing.path}`}
      component={ShopListPage}
    />
  </>
);
