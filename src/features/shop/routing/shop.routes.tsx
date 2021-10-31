import { FC, lazy } from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

const ShopLandingPage = lazy(() =>
  import('features/shop/pages/shop-landing-page.component').then((module: any) => ({
    default: module.ShopLandingPage
  }))
);

export const ShopRoutes: FC<RouteComponentProps> = ({ match }) => (
  <>
    <Route exact path={match.path} component={ShopLandingPage} />
  </>
);
