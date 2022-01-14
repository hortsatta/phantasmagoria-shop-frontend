import { useEffect, useMemo, useState } from 'react';
import { useLazyQuery } from '@apollo/client';

import { Order } from 'models';
import { GET_ORDERS_DETAIL } from 'services/graphql';

type Result = {
  orders: Order[];
  setOrderIds: any;
  loading: boolean;
};

export const useGetOrdersDetailByIds = (ids?: string[]): Result => {
  const [getOrdersDetail, { data: { orders = [] } = {}, loading }] =
    useLazyQuery(GET_ORDERS_DETAIL);
  const [orderIds, setOrderIds] = useState<string[]>(ids || []);
  const variables = useMemo(() => ({ where: { id_in: orderIds } }), [orderIds]);

  useEffect(() => {
    getOrdersDetail({ variables });
  }, [variables]);

  return { orders, setOrderIds, loading };
};
