import { useEffect, useMemo } from 'react';
import { useReactiveVar, useLazyQuery } from '@apollo/client';

import { cartItemsVar, currentUserAccountVar, guestCartVar } from 'config';
import { Cart, CartItem } from 'models';
import { GET_CARTS } from 'services/graphql';

type Result = {
  cart: Cart | null;
  loading: boolean;
};

export const useGetCart = (): Result => {
  const userAccount = useReactiveVar(currentUserAccountVar);
  const guestCart = useReactiveVar(guestCartVar);
  const cartItems = useReactiveVar(cartItemsVar);

  const [getCarts, { data: { carts = [] } = {}, loading: getCartsLoading, refetch }] =
    useLazyQuery(GET_CARTS);

  const cart = useMemo(() => {
    if (!carts || !carts.length) {
      return guestCart;
    }

    const { cartItems: currentCartItems, ...moreCart } = carts[0];
    const filteredCartItems = currentCartItems.filter((item: CartItem) => !!item.quantity);

    return { ...moreCart, cartItems: filteredCartItems };
  }, [carts]);

  useEffect(() => {
    if (!userAccount) {
      return;
    }
    getCarts({ variables: { where: { user_account: userAccount.id } } });
  }, [cartItems]);

  useEffect(() => {
    if (!refetch || (!!cartItems && cartItems.length)) {
      return;
    }
    refetch();
  }, [cartItems]);

  return { cart, loading: getCartsLoading };
};
