import { FC, lazy } from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

const FavoriteListPage = lazy(() =>
  import('../pages/favorite-list.page').then((module: any) => ({
    default: module.FavoriteListPage
  }))
);

export const FavoriteRoutes: FC<RouteComponentProps> = ({ match }) => (
  <Route exact path={match.path} component={FavoriteListPage} />
);
