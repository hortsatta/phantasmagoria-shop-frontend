import { useEffect, useMemo, useState } from 'react';
import { useLazyQuery } from '@apollo/client';

import { Card } from 'models';
import { GET_CARDS } from 'services/graphql';
import { useDebounceValue } from 'features/core/hooks';

type Result = {
  cards: Card[];
  searchKeyword: string;
  cardFilters: any;
  loading: boolean;
  setSearchKeyword: any;
  setCardFilters: any;
};

export const useGetCardsByFilters = (): Result => {
  const [getCards, { data: { cards = [] } = {}, loading: getCardsLoading }] =
    useLazyQuery(GET_CARDS);
  const [searchKeyword, setSearchKeyword] = useState('');
  const { debouncedValue: debounceSearchKeyword, loading: debounceSearchLoading } =
    useDebounceValue(searchKeyword);
  const [cardFilters, setCardFilters] = useState<any>({
    rarities: [],
    categories: [],
    types: []
  });

  const cardVariables = useMemo(() => {
    const { rarities, categories, types } = cardFilters;
    return {
      where: {
        name_contains: debounceSearchKeyword.trim(),
        ...(!!rarities.length && { rarity: { id_in: rarities } }),
        ...(!!categories.length && { category: { id_in: categories } }),
        ...(!!types.length && { types: { id_in: types } })
      }
    };
  }, [debounceSearchKeyword, cardFilters]);

  useEffect(() => {
    getCards({ variables: cardVariables });
  }, [cardVariables]);

  return {
    cards,
    searchKeyword,
    cardFilters,
    loading: getCardsLoading || debounceSearchLoading,
    setSearchKeyword,
    setCardFilters
  };
};
