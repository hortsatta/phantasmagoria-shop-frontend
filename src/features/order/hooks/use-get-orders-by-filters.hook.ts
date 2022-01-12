import { useEffect, useMemo, useState } from 'react';
import { useReactiveVar, useLazyQuery } from '@apollo/client';

import { currentUserAccountVar } from 'config';
import { Order } from 'models';
import { GET_ORDERS } from 'services/graphql';

type Result = {
  orders: Order[];
  orderSort: string | null;
  setOrderSort: any;
  loading: boolean;
};

export const useGetOrdersByFilters = (userAccountid?: string): Result => {
  const userAccount = useReactiveVar(currentUserAccountVar);
  const [getOrders, { data: { orders = [] } = {}, loading }] = useLazyQuery(GET_ORDERS);
  const [orderSort, setOrderSort] = useState<string | null>(null);

  const orderVariables = useMemo(
    () => ({
      ...(orderSort && { sort: orderSort }),
      where: {
        user_account: userAccount?.id || userAccountid
      }
    }),
    [orderSort, userAccount, userAccountid]
  );

  useEffect(() => {
    getOrders({ variables: orderVariables });
  }, [orderVariables]);

  return { orders, orderSort, setOrderSort, loading };
};
