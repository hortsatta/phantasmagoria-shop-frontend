import { FC, lazy } from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

const ShopListPage = lazy(() =>
  import('../pages/shop-list.page').then((module: any) => ({
    default: module.ShopListPage
  }))
);

export const ShopRoutes: FC<RouteComponentProps> = ({ match }) => (
  <Route exact path={match.path} component={ShopListPage} />
);
