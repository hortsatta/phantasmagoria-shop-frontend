import { useEffect, useMemo, useState } from 'react';
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

export const useGetShopItemsByFilters = (): Result => {
  // Card products query search with product or card name as keyword
  const [getCardProducts, { data: { cardProducts = [] } = {}, loading: getCardProductsLoading }] =
    useLazyQuery(GET_CARD_PRODUCTS);
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
            cards
          },
          {
            cards: {
              ...cards,
              name_contains: debounceSearchKeyword.trim()
            }
          }
        ]
      }
    };
  }, [debounceSearchKeyword, itemFilters, itemSort]);

  useEffect(() => {
    getCardProducts({ variables: itemVariables });
  }, [itemVariables]);

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
