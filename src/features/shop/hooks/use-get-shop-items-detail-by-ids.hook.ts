import { useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useReactiveVar } from '@apollo/client';

import { currentUserAccountVar } from 'config';
import { CardProduct } from 'models';
import { GET_CARD_PRODUCTS_DETAIL } from 'services/graphql';

type Result = {
  cardProducts: CardProduct[];
  setCardProductIds: any;
  loading: boolean;
};

export const useGetShopItemsDetailByIds = (ids?: string[]): Result => {
  const userAccount = useReactiveVar(currentUserAccountVar);
  const [getCardProductsDetail, { data: { cardProducts = [] } = {}, loading }] =
    useLazyQuery(GET_CARD_PRODUCTS_DETAIL);
  const [cardProductIds, setCardProductIds] = useState<string[]>(ids || []);
  const variables = useMemo(
    () => ({ userAccountId: userAccount?.id || '', where: { id_in: cardProductIds } }),
    [cardProductIds, userAccount]
  );

  useEffect(() => {
    getCardProductsDetail({ variables });
  }, [variables]);

  return { cardProducts, setCardProductIds, loading };
};
