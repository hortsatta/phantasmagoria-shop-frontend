import { FC, lazy, useMemo } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Route, RouteComponentProps } from 'react-router-dom';

import { appModulesVar } from 'config';

const OrderCompletePage = lazy(() =>
  import('../pages/order-complete.page').then((module: any) => ({
    default: module.OrderCompletePage
  }))
);

export const OrderRoutes: FC<RouteComponentProps> = ({ match }) => {
  const appModules: any = useReactiveVar(appModulesVar);
  const orderCompletePath = useMemo(
    () => `${match.path}${appModules.order.children?.complete.path}`,
    [appModules]
  );

  return (
    <>
      <Route path={orderCompletePath} component={OrderCompletePage} />
    </>
  );
};
