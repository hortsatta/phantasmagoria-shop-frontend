import { FC, lazy, useMemo } from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';

import { appModulesVar } from 'config';

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

const AddShopItemPage = lazy(() =>
  import('../pages/add-shop-item.page').then((module: any) => ({
    default: module.AddShopItemPage
  }))
);

export const ShopRoutes: FC<RouteComponentProps> = ({ match }) => {
  const appModules: any = useReactiveVar(appModulesVar);

  const landingPath = useMemo(
    () => `${appModules.shop.path}${appModules.shop.children?.landing.path}`,
    [appModules]
  );

  const addItemPath = useMemo(
    () => `${appModules.shop.path}${appModules.shop.children?.add.path}`,
    [appModules]
  );

  return (
    <>
      <Route exact path={match.path} component={ShopListPage} />
      <Route path={landingPath} component={ShopListPage} />
      <Route path={addItemPath} component={AddShopItemPage} />
    </>
  );
};
