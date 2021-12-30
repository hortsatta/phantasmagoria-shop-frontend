import { useCallback, useEffect, useState } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';

import { cartItemsVar } from 'config';
import { CardProduct } from 'models';
import { CLEAR_CART_ITEMS } from 'services/graphql';
import { useDebounce } from 'features/core/hooks';
import { CartItemFormData } from '../components';

type Result = {
  updateCartItems: (items: CartItemFormData[]) => void;
  clearCartItems: () => void;
  addCartItem: (cardProduct: CardProduct) => void;
  loading: boolean;
};

export const useUpsertCart = (): Result => {
  const [currentCartItems, setCurrentCartItems] = useState<any>([]);
  const cartItems = useReactiveVar(cartItemsVar);
  const [clearCart, { loading: clearCartItemsLoading }] = useMutation(CLEAR_CART_ITEMS);
  const { debounce, loading: debounceLoading } = useDebounce();

  const updateCartItems = useCallback((items: CartItemFormData[]) => {
    cartItemsVar([...items]);
  }, []);

  const clearCartItems = useCallback(async () => {
    debounce();
    await clearCart();
    cartItemsVar([]);
  }, []);

  const addCartItem = useCallback(
    (cardProduct: CardProduct) => {
      const targetItem = currentCartItems.find(
        (item: any) => item.cardProduct.id.toString() === cardProduct.id.toString()
      );

      let items = currentCartItems;
      if (targetItem) {
        items = currentCartItems.map((item: any) => {
          if (item.cardProduct.id.toString() === cardProduct.id.toString()) {
            return {
              ...item,
              currentQuantity: item.currentQuantity + 1
            };
          }

          return item;
        });
      } else {
        items = [...currentCartItems, { cardProduct, quantity: 0, currentQuantity: 1 }];
      }

      setCurrentCartItems(items);
    },
    [currentCartItems]
  );

  useEffect(() => {
    !cartItems.length && setCurrentCartItems([]);
  }, [cartItems]);

  useEffect(() => {
    currentCartItems.length && cartItemsVar([...currentCartItems]);
  }, [currentCartItems]);

  return {
    updateCartItems,
    clearCartItems,
    addCartItem,
    loading: clearCartItemsLoading || debounceLoading
  };
};
