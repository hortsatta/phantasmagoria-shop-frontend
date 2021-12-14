import { FC, lazy, useMemo } from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';

import { appModulesVar } from 'config';
import { CardRoutes } from 'features/card/routing';

const AddShopItemPage = lazy(() =>
  import('features/shop/pages/add-shop-item.page').then((module: any) => ({
    default: module.AddShopItemPage
  }))
);

// const EditShopItemPage = lazy(() =>
//   import('features/shop/pages/edit-shop-item.page').then((module: any) => ({
//     default: module.EditShopItemPage
//   }))
// );

export const AdminRoutes: FC<RouteComponentProps> = ({ match }) => {
  const appModules: any = useReactiveVar(appModulesVar);

  const addShopItemPath = useMemo(
    () => `${match.path}${appModules.shop.path}${appModules.shop.children?.add.path}`,
    [appModules]
  );

  // const editShopItemPath = useMemo(
  //   () => `${match.path}${appModules.shop.path}${appModules.shop.children?.edit.path}`,
  //   [appModules]
  // );

  const cardPath = useMemo(() => `${match.path}${appModules.card.path}`, [appModules]);

  return (
    <>
      <Route exact path={addShopItemPath} component={AddShopItemPage} />
      {/* <Route exact path={editShopItemPath} component={EditShopItemPage} /> */}
      <Route path={cardPath} component={CardRoutes} />
    </>
  );
};
