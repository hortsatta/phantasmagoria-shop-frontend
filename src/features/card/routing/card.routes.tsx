import { FC, lazy, useMemo } from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';

import { appModulesVar } from 'config';

const AddCardPage = lazy(() =>
  import('../pages/add-card.page').then((module: any) => ({
    default: module.AddCardPage
  }))
);

// const EditCardPage = lazy(() =>
//   import('../pages/edit-card.page').then((module: any) => ({
//     default: module.EditCardPage
//   }))
// );

export const CardRoutes: FC<RouteComponentProps> = ({ match }) => {
  const appModules: any = useReactiveVar(appModulesVar);

  const addPath = useMemo(() => `${match.path}${appModules.card.children?.add.path}`, [appModules]);

  // const editPath = useMemo(
  //   () => `${match.path}${appModules.card.children?.edit.path}`,
  //   [appModules]
  // );

  return (
    <>
      <Route path={addPath} component={AddCardPage} />
      {/* <Route path={editPath} component={EditCardPage} /> */}
    </>
  );
};
