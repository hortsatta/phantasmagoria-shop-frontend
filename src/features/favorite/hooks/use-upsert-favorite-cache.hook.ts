import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useApolloClient, useReactiveVar } from '@apollo/client';

import { favItemsLoadingVar, favoriteItemsVar } from 'config';
import { CardProduct } from 'models';
import { useDebounceValue } from 'features/core/hooks';
import { DEBOUNCE_DURATION } from './use-effect-upsert-favorite.hook';

type Result = {
  favoriteItems: any[];
  processingFavItems: any[];
  updateFavoriteItem: (item: CardProduct) => void;
};

export const useUpsertFavoriteCache = (isRemoveOnly?: boolean): Result => {
  const { cache: clientCache } = useApolloClient();
  const favoriteItems = useReactiveVar(favoriteItemsVar);
  const favItemsLoading = useReactiveVar(favItemsLoadingVar);
  const { debouncedValue: debounceFavoriteItems } = useDebounceValue(
    favoriteItems,
    DEBOUNCE_DURATION
  );
  const currentFavoriteItems = useRef<any>([]);

  const processingFavItems = useMemo(() => {
    if (!favItemsLoading) {
      return {};
    }

    return favoriteItems
      .filter(item => !item.isFavorite)
      .reduce((total, val) => ({ ...total, [val.id]: val.id }), {});
  }, [favoriteItems, favItemsLoading]);

  useEffect(() => {
    if (!isRemoveOnly || !debounceFavoriteItems.length) {
      return;
    }

    debounceFavoriteItems.forEach((fi: any) => {
      clientCache.evict({
        id: clientCache.identify(fi)
      });
    });
    clientCache.gc();
  }, [debounceFavoriteItems]);

  const updateFavoriteItem = useCallback(
    (item: CardProduct) => {
      const { id, favorites } = item;
      const isFavorite = !favorites?.length;
      const targetItem = currentFavoriteItems.current.find((fi: any) => fi.id === id);
      // Add item and set isFavorite field
      if (targetItem) {
        currentFavoriteItems.current = currentFavoriteItems.current.map((fi: any) =>
          fi.id === targetItem.id ? { ...fi, isFavorite } : fi
        );
        favoriteItemsVar(currentFavoriteItems.current);
      } else {
        currentFavoriteItems.current = [...currentFavoriteItems.current, { ...item, isFavorite }];
        favoriteItemsVar(currentFavoriteItems.current);
      }

      if (isRemoveOnly) {
        return;
      }
      // Update item apollo cache
      clientCache.modify({
        id: clientCache.identify(item),
        fields: {
          favorites: () => (!isFavorite ? [] : [{ id: '1' }])
        }
      });
    },
    [currentFavoriteItems, isRemoveOnly]
  );

  useEffect(() => {
    if (favoriteItems.length) {
      return;
    }
    currentFavoriteItems.current = [];
  }, [favoriteItems]);

  return {
    favoriteItems,
    processingFavItems,
    updateFavoriteItem
  };
};
