import { useEffect, useMemo } from 'react';
import { useReactiveVar, useQuery } from '@apollo/client';

import { cartItemsVar, currentUserAccountVar } from 'config';
import { Cart, CartItem } from 'models';
import { GET_CARTS } from 'services/graphql';

type Result = {
  cart: Cart | null;
  loading: boolean;
};

export const useGetCart = (): Result => {
  const userAccount = useReactiveVar(currentUserAccountVar);
  const cartItems = useReactiveVar(cartItemsVar);

  const {
    data: { carts = [] } = {},
    loading: getCartsLoading,
    refetch
  } = useQuery(GET_CARTS, {
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

  useEffect(() => {
    if (cartItems.length) {
      return;
    }

    refetch();
  }, [cartItems]);

  return { cart, loading: getCartsLoading };
};
