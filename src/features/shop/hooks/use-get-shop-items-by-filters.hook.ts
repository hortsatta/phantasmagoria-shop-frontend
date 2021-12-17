import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';

import { CardProduct } from 'models';
import { GET_CARD_PRODUCTS } from 'services/graphql';
import { useDebounceValue } from 'features/core/hooks';

type Result = {
  items: CardProduct[];
  searchKeyword: string;
  itemSort: string | null;
  itemFilters: any;
  loading: boolean;
  setSearchKeyword: any;
  setItemSort: any;
  setItemFilters: any;
};

export const useGetShopItemsByFilters = (locState?: any): Result => {
  const history = useHistory();
  // Card products query search with product or card name as keyword
  const [
    getCardProducts,
    { data: { cardProducts = [] } = {}, loading: getCardProductsLoading, refetch }
  ] = useLazyQuery(GET_CARD_PRODUCTS);
  const [itemFilters, setItemFilters] = useState<any>(null);
  const [itemSort, setItemSort] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const { debouncedValue: debounceSearchKeyword, loading: debounceSearchLoading } =
    useDebounceValue(searchKeyword);

  const itemVariables = useMemo(() => {
    const { rarities, categories, types } = itemFilters || {};

    const cards = {
      ...(!!rarities?.length && { rarity: { id_in: rarities } }),
      ...(!!categories?.length && { category: { id_in: categories } }),
      ...(!!types?.length && { types: { id_in: types } })
    };

    return {
      ...(itemSort && { sort: itemSort }),
      where: {
        _or: [
          {
            name_contains: debounceSearchKeyword.trim(),
            cards,
            isActive: true
          },
          {
            cards: {
              ...cards,
              name_contains: debounceSearchKeyword.trim(),
              isActive: true
            }
          }
        ]
      }
    };
  }, [debounceSearchKeyword, itemFilters, itemSort]);

  useEffect(() => {
    getCardProducts({ variables: itemVariables });
  }, [itemVariables]);

  useEffect(() => {
    if (!refetch || !locState?.refetch) {
      return;
    }

    // Refetch and clear history state to prevent refetch on reload.
    refetch(itemVariables);
    history.replace({ state: {} });
  }, [locState, refetch]);

  return {
    items: cardProducts,
    searchKeyword,
    itemSort,
    itemFilters,
    loading: getCardProductsLoading || debounceSearchLoading,
    setSearchKeyword,
    setItemSort,
    setItemFilters
  };
};
