import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
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

export const useGetCardsByFilters = (locState?: any): Result => {
  const history = useHistory();
  const [getCards, { data: { cards = [] } = {}, loading: getCardsLoading, refetch }] =
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
        isActive: true,
        ...(!!rarities.length && { rarity: { id_in: rarities } }),
        ...(!!categories.length && { category: { id_in: categories } }),
        ...(!!types.length && { types: { id_in: types } })
      }
    };
  }, [debounceSearchKeyword, cardFilters]);

  useEffect(() => {
    getCards({ variables: cardVariables });
  }, [cardVariables]);

  useEffect(() => {
    if (!refetch || !locState?.refetch) {
      return;
    }
    // Refetch and clear history state to prevent refetch on reload.
    refetch(cardVariables);
    history.replace({ state: {} });
  }, [locState, refetch]);

  return {
    cards,
    searchKeyword,
    cardFilters,
    loading: getCardsLoading || debounceSearchLoading,
    setSearchKeyword,
    setCardFilters
  };
};
