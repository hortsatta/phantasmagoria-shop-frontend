import { useCallback, useEffect, useMemo } from 'react';
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
      const targetItem = favoriteItems.find(fi => fi.id === id);
      // Add item and set isFavorite field
      if (targetItem) {
        favoriteItemsVar(
          favoriteItems.map(fi => (fi.id === targetItem.id ? { ...fi, isFavorite } : fi))
        );
      } else {
        favoriteItemsVar([...favoriteItems, { ...item, isFavorite }]);
      }

      if (isRemoveOnly) {
        return;
      }
      // Update item apollo cache
      clientCache.modify({
        id: clientCache.identify(item),
        fields: {
          favorites: () => (favorites?.length ? [] : [{ id: '0' }])
        }
      });
    },
    [favoriteItems, isRemoveOnly]
  );

  return {
    favoriteItems,
    processingFavItems,
    updateFavoriteItem
  };
};
