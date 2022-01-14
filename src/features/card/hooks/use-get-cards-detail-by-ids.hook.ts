import { useEffect, useMemo, useState } from 'react';
import { useLazyQuery } from '@apollo/client';

import { Card } from 'models';
import { GET_CARDS_DETAIL } from 'services/graphql';

type Result = {
  cards: Card[];
  setCardIds: any;
  loading: boolean;
};

export const useGetCardsDetailByIds = (ids?: string[]): Result => {
  const [getCardsDetail, { data: { cards = [] } = {}, loading }] = useLazyQuery(GET_CARDS_DETAIL);
  const [cardIds, setCardIds] = useState<string[]>(ids || []);
  const variables = useMemo(() => ({ where: { id_in: cardIds } }), [cardIds]);

  useEffect(() => {
    getCardsDetail({ variables });
  }, [variables]);

  return { cards, setCardIds, loading };
};
