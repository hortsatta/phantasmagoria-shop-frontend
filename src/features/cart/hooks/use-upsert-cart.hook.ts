import { useCallback, useEffect, useState } from 'react';
import { cartItemsVar } from 'config';
import { CartItemFormData } from '../components';
import { CardProduct } from 'models';

type Result = {
  updateCartItems: (items: CartItemFormData[]) => void;
  addCartItem: (cardProduct: CardProduct) => void;
};

export const useUpsertCart = (): Result => {
  const [currentCartItems, setCurrentCartItems] = useState<any>([]);

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

  useEffect(() => {
    currentCartItems.length && cartItemsVar([...currentCartItems]);
  }, [currentCartItems]);

  return { updateCartItems, addCartItem };
};
