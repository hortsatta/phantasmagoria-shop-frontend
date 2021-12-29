import { useMemo } from 'react';
import { useReactiveVar, useQuery } from '@apollo/client';

import { currentUserAccountVar } from 'config';
import { Cart, CartItem } from 'models';
import { GET_CARTS } from 'services/graphql';

type Result = {
  cart: Cart | null;
  loading: boolean;
};

export const useGetCart = (): Result => {
  const userAccount = useReactiveVar(currentUserAccountVar);

  const { data: { carts = [] } = {}, loading: getCartsLoading } = useQuery(GET_CARTS, {
    variables: { where: { user_account: userAccount?.id } }
  });

  const cart = useMemo(() => {
    if (!carts.length) {
      return null;
    }

    const { cartItems: currentCartItems, ...moreCart } = carts[0];
    const filteredCartItems = currentCartItems.filter((item: CartItem) => !!item.quantity);

    return { ...moreCart, cartItems: filteredCartItems };
  }, [carts]);

  return { cart, loading: getCartsLoading };
};
