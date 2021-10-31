import { FC, lazy } from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

const CartPage = lazy(() =>
  import('../pages/cart.page').then((module: any) => ({
    default: module.CartPage
  }))
);

export const CartRoutes: FC<RouteComponentProps> = ({ match }) => (
  <>
    <Route exact path={match.path} component={CartPage} />
  </>
);
