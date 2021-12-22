import { useCallback, useEffect } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';

import { favItemsLoadingVar, favoriteItemsVar, messages } from 'config';
import { UPDATE_FAVORITE_ITEMS } from 'services/graphql';
import { useDebounceValue, useNotification } from 'features/core/hooks';

const DEBOUNCE_DURATION = 1000;

const useEffectUpsertFavorite = () => {
  const { notify } = useNotification();
  const [updateFavoriteItems] = useMutation(UPDATE_FAVORITE_ITEMS);
  const favoriteItems = useReactiveVar(favoriteItemsVar);
  const { debouncedValue: debounceFavoriteItems, loading: debounceFavItemsLoading } =
    useDebounceValue(favoriteItems, DEBOUNCE_DURATION);

  useEffect(() => {
    favItemsLoadingVar(debounceFavItemsLoading);
  }, [debounceFavItemsLoading]);

  const updateFavorites = useCallback(async (items: any[]) => {
    const addItems = items.filter((fi: any) => fi.isFavorite).map((fi: any) => fi.id);
    const removeItems = items.filter((fi: any) => !fi.isFavorite).map((fi: any) => fi.id);

    try {
      const variables = { addItems, removeItems };
      await updateFavoriteItems({ variables });
      favoriteItemsVar([]);
    } catch (err) {
      notify('error', 'Failed', messages.problem);
    }
  }, []);

  useEffect(() => {
    if (!debounceFavoriteItems.length) {
      return;
    }
    updateFavorites(debounceFavoriteItems);
  }, [debounceFavoriteItems]);
};

export { DEBOUNCE_DURATION, useEffectUpsertFavorite };
