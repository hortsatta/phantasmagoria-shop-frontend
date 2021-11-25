import { FC, lazy, useMemo } from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';

import { appModulesVar } from 'config';

const AddCardPage = lazy(() =>
  import('../pages/add-card.page').then((module: any) => ({
    default: module.AddCardPage
  }))
);

export const CardRoutes: FC<RouteComponentProps> = ({ match }) => {
  const appModules: any = useReactiveVar(appModulesVar);

  const addPath = useMemo(
    () => `${appModules.card.path}${appModules.card.children?.add.path}`,
    [appModules]
  );
  const editPath = useMemo(
    () => `${appModules.card.path}${appModules.card.children?.edit.path}`,
    [appModules]
  );

  return (
    <>
      <Route exact path={addPath} component={AddCardPage} />
      {/* <Route path={editPath} component={EditCardPage} /> */}
    </>
  );
};
