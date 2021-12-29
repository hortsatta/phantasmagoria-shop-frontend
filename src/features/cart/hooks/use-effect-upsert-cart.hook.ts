import { useCallback, useEffect } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';

import { cartItemsLoadingVar, cartItemsVar, messages } from 'config';
import { UPDATE_CART_ITEMS } from 'services/graphql';
import { useDebounceValue, useNotification } from 'features/core/hooks';
import { CartItemFormData } from '../components';

const DEBOUNCE_DURATION = 1000;

const useEffectUpsertCart = () => {
  const { notify } = useNotification();
  const [updateCartItems] = useMutation(UPDATE_CART_ITEMS);
  const cartItems = useReactiveVar(cartItemsVar);
  const { debouncedValue: debounceCartItems, loading: debounceCartItemsLoading } = useDebounceValue(
    cartItems,
    DEBOUNCE_DURATION
  );

  const updateCart = useCallback(async (items: any[]) => {
    const updateItems = items
      .filter((item: CartItemFormData) => item.quantity + (item.currentQuantity || 0) > 0)
      .map((item: CartItemFormData) => ({
        quantity: item.currentQuantity,
        cardProduct: item.cardProduct.id
      }));

    const removeItems = items
      .filter((item: CartItemFormData) => item.currentQuantity === undefined)
      .map((item: CartItemFormData) => ({ quantity: 0, cardProduct: item.cardProduct.id }));

    if (!updateItems.length && !removeItems.length) {
      return;
    }

    try {
      const variables = { updateItems, removeItems };
      await updateCartItems({ variables });
      cartItemsVar([]);
    } catch (err) {
      notify('error', 'Failed', messages.problem);
      cartItemsVar([]);
    }
  }, []);

  useEffect(() => {
    cartItemsLoadingVar(debounceCartItemsLoading);
  }, [debounceCartItemsLoading]);

  useEffect(() => {
    if (!debounceCartItems.length) {
      return;
    }
    updateCart(debounceCartItems);
  }, [debounceCartItems]);
};

export { DEBOUNCE_DURATION, useEffectUpsertCart };
