import { FC, lazy } from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import { navConfig } from 'features/core/components';

const AddCardPage = lazy(() =>
  import('../pages/add-card.page').then((module: any) => ({
    default: module.AddCardPage
  }))
);

const addPath = `${navConfig.card.path}${navConfig.card.children?.add.path}`;
const editPath = `${navConfig.card.path}${navConfig.card.children?.edit.path}`;

export const CardRoutes: FC<RouteComponentProps> = ({ match }) => (
  <>
    <Route exact path={addPath} component={AddCardPage} />
    {/* <Route path={editPath} component={EditCardPage} /> */}
  </>
);
