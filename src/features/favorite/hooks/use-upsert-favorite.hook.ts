import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApolloClient, useMutation, useQuery, useReactiveVar } from '@apollo/client';

import { currentUserAccountVar, messages } from 'config';
import { arrayUnion } from 'helpers';
import { CardProduct } from 'models';
import { CREATE_FAVORITE, GET_FAVORITES, UPDATE_FAVORITE } from 'services/graphql';
import { useDebounceValue, useNotification } from 'features/core/hooks';

type Result = {
  updateItemFavorite: (item: CardProduct) => void;
};

export const useUpsertFavorite = (): Result => {
  const client = useApolloClient();
  const { notify } = useNotification();
  const currentUserAccount = useReactiveVar(currentUserAccountVar);
  const userAccountId = useMemo(() => currentUserAccount?.id || '', [currentUserAccount]);
  const [createFavorite] = useMutation(CREATE_FAVORITE);
  const [updateFavorite] = useMutation(UPDATE_FAVORITE);
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const { debouncedValue: debounceFavoriteItems } = useDebounceValue(favoriteItems, 1000);

  const {
    data: { favorites: currentFavorites = [] } = {},
    loading: getFavoritesLoading,
    refetch
  } = useQuery(GET_FAVORITES, {
    variables: { where: { user_account: userAccountId } }
  });

  useEffect(() => {
    if (!debounceFavoriteItems.length || getFavoritesLoading || !currentUserAccount) {
      return;
    }
    const { id: currentFavoriteId, cardProducts: currentCardProducts = [] } =
      currentFavorites[0] || {};
    const itemsToAppend = favoriteItems.filter(fi => fi.isFavorite);
    const itemsToRemove = favoriteItems.filter(fi => !fi.isFavorite);
    // Append and remove items from favorite
    const newFavoriteItems = arrayUnion(currentCardProducts, itemsToAppend, 'id').filter(
      (cp: CardProduct) => !itemsToRemove.some(item => cp.id === item.id)
    );

    (async () => {
      try {
        if (!currentFavorites || !currentFavorites.length) {
          const variables = {
            favorite: {
              user_account: userAccountId,
              card_products: newFavoriteItems.map(fi => fi.id)
            }
          };
          await createFavorite({ variables });
        } else {
          const variables = {
            id: currentFavoriteId,
            favorite: { card_products: newFavoriteItems.map(fi => fi.id) }
          };
          await updateFavorite({ variables });
        }
        refetch();
      } catch (err) {
        notify('error', 'Failed', messages.problem);
      }
    })();
  }, [debounceFavoriteItems]);

  const toggleFavoriteItems = useCallback(
    (item: CardProduct) => {
      const { id, favorites } = item;
      const isFavorite = !favorites?.length;
      const targetItem = favoriteItems.find(fi => fi.id === id);

      if (targetItem) {
        setFavoriteItems(
          favoriteItems.map(fi => (fi.id === targetItem.id ? { ...fi, isFavorite } : fi))
        );
      } else {
        setFavoriteItems([...favoriteItems, { id, isFavorite }]);
      }
    },
    [favoriteItems]
  );

  const updateItemFavorite = useCallback(
    (item: CardProduct) => {
      const { favorites } = item;

      client.cache.modify({
        id: client.cache.identify(item),
        fields: {
          favorites: () => (favorites?.length ? [] : [{ id: '0' }])
        }
      });

      toggleFavoriteItems(item);
    },
    [toggleFavoriteItems]
  );

  return {
    updateItemFavorite
  };
};
