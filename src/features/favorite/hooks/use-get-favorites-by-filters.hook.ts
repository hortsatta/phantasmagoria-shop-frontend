import { useEffect, useMemo, useRef, useState } from 'react';
import { useApolloClient, useLazyQuery, useReactiveVar } from '@apollo/client';

import { currentUserAccountVar, favoriteItemsVar } from 'config';
import { Card, CardProduct } from 'models';
import { GET_FAVORITES } from 'services/graphql';
import { useDebounceValue } from 'features/core/hooks';

type Result = {
  items: CardProduct[];
  searchKeyword: string;
  loading: boolean;
  setSearchKeyword: any;
};

export const useGetFavoritesByFilters = (): Result => {
  const client = useApolloClient();
  const hasRefetched = useRef(false);
  const userAccount = useReactiveVar(currentUserAccountVar);
  const favoriteItems = useReactiveVar(favoriteItemsVar);
  const [getFavorites, { data: { favorites = [] } = {}, loading: getFavoritesLoading, refetch }] =
    useLazyQuery(GET_FAVORITES);
  const [searchKeyword, setSearchKeyword] = useState('');
  const { debouncedValue: debounceSearchKeyword, loading: debounceSearchLoading } =
    useDebounceValue(searchKeyword);

  const filteredCardProducts: CardProduct[] = useMemo(() => {
    if (!favorites || !favorites.length) {
      return [];
    }

    const { cardProducts } = favorites[0];
    const items = cardProducts.filter(
      (cp: CardProduct) =>
        cp.name.includes(debounceSearchKeyword) ||
        cp.cards.some((c: Card) => c.name.includes(debounceSearchKeyword))
    );

    return items.filter((item: CardProduct) => !!item.favorites);
  }, [favorites, debounceSearchKeyword]);

  useEffect(() => {
    if (favoriteItems.length || hasRefetched.current || !refetch) {
      return;
    }
    hasRefetched.current = true;
    refetch();
    client.resetStore();
  }, [favoriteItems, refetch]);

  useEffect(() => {
    if (!userAccount) {
      return;
    }

    const variables = {
      userAccountId: userAccount?.id || '',
      where: { user_account: userAccount?.id || '' }
    };
    getFavorites({ variables });
  }, [userAccount]);

  return {
    items: filteredCardProducts,
    searchKeyword,
    loading: getFavoritesLoading || debounceSearchLoading,
    setSearchKeyword
  };
};
