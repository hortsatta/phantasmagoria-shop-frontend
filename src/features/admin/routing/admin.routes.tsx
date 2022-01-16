import { FC, lazy, useMemo } from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';

import { appModulesVar } from 'config';
import { CardProductRbacType, CardRbacType } from 'config/rbac';
import { CardRoutes } from 'features/card/routing';
import { useGuard } from 'features/core/hooks';

const AddShopItemPage = lazy(() =>
  import('features/shop/pages/add-shop-item.page').then((module: any) => ({
    default: module.AddShopItemPage
  }))
);

const EditShopItemPage = lazy(() =>
  import('features/shop/pages/edit-shop-item.page').then((module: any) => ({
    default: module.EditShopItemPage
  }))
);

export const AdminRoutes: FC<RouteComponentProps> = ({ match }) => {
  const { canActivate } = useGuard();
  const appModules: any = useReactiveVar(appModulesVar);

  const addShopItemPath = useMemo(
    () => `${match.path}${appModules.shop.path}${appModules.shop.children?.add.path}`,
    [appModules]
  );

  const editShopItemPath = useMemo(
    () => `${match.path}${appModules.shop.path}/:slug${appModules.shop.children?.edit.path}`,
    [appModules]
  );

  const cardPath = useMemo(() => `${match.path}${appModules.card.path}`, [appModules]);

  return (
    <>
      {canActivate([CardProductRbacType.CREATE]) && (
        <Route exact path={addShopItemPath} component={AddShopItemPage} />
      )}
      {canActivate([CardProductRbacType.CREATE]) && (
        <Route exact path={editShopItemPath} component={EditShopItemPage} />
      )}
      {canActivate([CardRbacType.CREATE, CardRbacType.UPDATE]) && (
        <Route path={cardPath} component={CardRoutes} />
      )}
    </>
  );
};
