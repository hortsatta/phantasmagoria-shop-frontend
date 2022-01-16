import { useCallback, useEffect, useState } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';

import { cartItemsVar, currentUserAccountVar, guestCartVar, messages } from 'config';
import { CardProduct, Cart } from 'models';
import { CLEAR_CART, CLEAR_CART_ITEMS, CREATE_CART } from 'services/graphql';
import { useDebounce, useNotification } from 'features/core/hooks';
import { CartItemFormData } from '../components';

type Result = {
  createCartFromGuestCart: () => void;
  addCartItem: (cardProduct: CardProduct) => void;
  updateCartItems: (items: CartItemFormData[]) => void;
  clearCartItems: (cart?: Cart) => void;
  clearCart: () => void;
  loading: boolean;
};

export const useUpsertCart = (): Result => {
  const { notify } = useNotification();
  const userAccount = useReactiveVar(currentUserAccountVar);
  const guestCart = useReactiveVar(guestCartVar);
  const cartItems = useReactiveVar(cartItemsVar);
  const [createCart, { loading: createCartLoading }] = useMutation(CREATE_CART);
  const [clearCartItemsMutate, { loading: clearCartItemsLoading, client }] =
    useMutation(CLEAR_CART_ITEMS);
  const [clearCartMutate, { loading: clearCartLoading }] = useMutation(CLEAR_CART);
  const { debounce, loading: debounceLoading } = useDebounce();
  const [currentCartItems, setCurrentCartItems] = useState<any>([]);

  const createCartFromGuestCart = useCallback(async () => {
    try {
      const guestCartItems = guestCart.cartItems.map(ci => ({
        quantity: ci.quantity,
        cardProduct: ci.cardProduct.id
      }));

      const variables = { cart: { cartItems: guestCartItems } };
      await createCart({ variables });
    } catch (err) {
      notify('error', 'Failed', messages.problem);
    }
  }, [guestCart]);

  const updateCartItems = useCallback((items: CartItemFormData[]) => {
    cartItemsVar([...items]);
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

  const clearCart = useCallback(async () => {
    debounce();
    try {
      await clearCartMutate();
      cartItemsVar([]);
    } catch (err) {
      notify('error', 'Failed', messages.problem);
    }
  }, []);

  const clearCartItems = useCallback(
    async (cart?: Cart) => {
      debounce();
      try {
        guestCartVar({ ...guestCart, cartItems: [] });
        cartItemsVar([]);

        if (userAccount) {
          await clearCartItemsMutate();

          // Manually clear cart in cache.
          if (!cart) {
            return;
          }
          const { cache } = client;
          cache.modify({
            id: cache.identify(cart),
            fields: {
              cartItems() {
                return [];
              }
            }
          });
        }
      } catch (err) {
        notify('error', 'Failed', messages.problem);
      }
    },
    [guestCart]
  );

  useEffect(() => {
    !cartItems.length && setCurrentCartItems([]);
  }, [cartItems]);

  useEffect(() => {
    currentCartItems.length && cartItemsVar([...currentCartItems]);
  }, [currentCartItems]);

  return {
    createCartFromGuestCart,
    addCartItem,
    updateCartItems,
    clearCartItems,
    clearCart,
    loading: createCartLoading || clearCartItemsLoading || clearCartLoading || debounceLoading
  };
};
