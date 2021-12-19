import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';

import { GET_FAVORITES } from 'services/graphql';
import { useDebounceValue } from 'features/core/hooks';
import { Card, CardProduct } from 'models';

type Result = {
  items: CardProduct[];
  searchKeyword: string;
  loading: boolean;
  setSearchKeyword: any;
};

export const useGetFavoritesByFilters = (): Result => {
  const { data: { favorites = [] } = {}, loading: getFavoritesLoading } = useQuery(GET_FAVORITES);
  const [searchKeyword, setSearchKeyword] = useState('');
  const { debouncedValue: debounceSearchKeyword, loading: debounceSearchLoading } =
    useDebounceValue(searchKeyword);

  const filteredCardProducts: CardProduct[] = useMemo(() => {
    if (!favorites.length) {
      return [];
    }

    const { cardProducts } = favorites[0];
    return cardProducts.filter(
      (cp: CardProduct) =>
        cp.name.includes(debounceSearchKeyword) ||
        cp.cards.some((c: Card) => c.name.includes(debounceSearchKeyword))
    );
  }, [favorites, debounceSearchKeyword]);

  return {
    items: filteredCardProducts,
    searchKeyword,
    loading: getFavoritesLoading || debounceSearchLoading,
    setSearchKeyword
  };
};
