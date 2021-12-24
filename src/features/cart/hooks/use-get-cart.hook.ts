import { useMemo } from 'react';
import { useReactiveVar, useQuery } from '@apollo/client';

import { currentUserAccountVar } from 'config';
import { CartItem } from 'models';
import { GET_CARTS } from 'services/graphql';

type Result = {
  cartItems: CartItem[];
  loading: boolean;
};

export const useGetCart = (): Result => {
  const userAccount = useReactiveVar(currentUserAccountVar);

  const { data: { carts = [] } = {}, loading: getCartsLoading } = useQuery(GET_CARTS, {
    variables: { where: { user_account: userAccount?.id } }
  });

  const cartItems = useMemo(() => {
    if (!carts.length) {
      return [];
    }

    const { cartItems: items } = carts[0];
    return items.filter((cartItem: CartItem) => !!cartItem.quantity);
  }, [carts]);

  return {
    cartItems,
    loading: getCartsLoading
  };
};
