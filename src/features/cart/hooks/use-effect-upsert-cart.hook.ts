import { useCallback, useEffect } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import { nanoid } from 'nanoid';

import {
  cartItemsLoadingVar,
  cartItemsVar,
  currentUserAccountVar,
  guestCartVar,
  messages
} from 'config';
import { UPDATE_CART_ITEMS } from 'services/graphql';
import { useDebounceValue, useNotification } from 'features/core/hooks';
import { CartItemFormData } from '../components';

const DEBOUNCE_DURATION = 1000;

const useEffectUpsertCart = () => {
  const { notify } = useNotification();
  const [updateCartItems] = useMutation(UPDATE_CART_ITEMS);
  const userAccount = useReactiveVar(currentUserAccountVar);
  const guestCart = useReactiveVar(guestCartVar);
  const cartItems = useReactiveVar(cartItemsVar);
  const { debouncedValue: debounceCartItems, loading: debounceCartItemsLoading } = useDebounceValue(
    cartItems,
    DEBOUNCE_DURATION
  );

  const updateGuestCart = (items: any[]) => {
    const updateItems: any = items
      .filter((item: CartItemFormData) => item.quantity + (item.currentQuantity || 0) > 0)
      .map((item: CartItemFormData) => ({ ...item, quantity: item.currentQuantity }));

    const removeItems: any = items
      .filter((item: CartItemFormData) => item.currentQuantity === undefined)
      .map((item: CartItemFormData) => ({ ...item, quantity: 0 }));

    if (!updateItems.length && !removeItems.length) {
      return;
    }

    const mergedItems = [
      ...updateItems.map(({ quantity, cardProduct }: any) => ({ quantity, cardProduct })),
      ...guestCart.cartItems
    ];
    const set = new Set();
    // Remove duplicates
    const newItems = mergedItems
      .filter(item => {
        if (!set.has(item.cardProduct.id)) {
          set.add(item.cardProduct.id);
          return true;
        }
        return false;
      }, set)
      .map(item => {
        if (item.id !== undefined) {
          return item;
        }
        const target = guestCart.cartItems.find(
          ci => ci.cardProduct.id.toString() === item.cardProduct.id.toString()
        );
        return target
          ? { ...target, quantity: target.quantity + item.quantity }
          : { ...item, id: nanoid() };
      });
    // And filter removed items
    const filteredNewItems = newItems.filter(
      ci =>
        !removeItems.some(
          (item: any) => ci.cardProduct.id.toString() === item.cardProduct.id.toString()
        )
    );
    // Update guest cart and clear cart items.
    guestCartVar({ ...guestCart, cartItems: filteredNewItems });
    cartItemsVar([]);
  };

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
    } catch (err) {
      notify('error', 'Failed', messages.problem);
    } finally {
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
    userAccount ? updateCart(debounceCartItems) : updateGuestCart(debounceCartItems);
  }, [debounceCartItems]);
};

export { DEBOUNCE_DURATION, useEffectUpsertCart };
