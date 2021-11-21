import { ComponentType, useEffect, useState } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';

import { cardCategoriesVar, cardRaritiesVar, cardTypesVar, currentUserVar } from 'config';
import {
  CHECK_SESSION,
  GET_ALL_CATEGORIES,
  GET_ALL_RARITIES,
  GET_ALL_TYPES
} from 'services/graphql';

export const withPrerequisite = <T,>(Component: ComponentType<T>) => {
  return (hocProps: T) => {
    const { data: userData } = useQuery(CHECK_SESSION);
    const { data: raritiesData } = useQuery(GET_ALL_RARITIES);
    const { data: categoriesData } = useQuery(GET_ALL_CATEGORIES);
    const { data: typesData } = useQuery(GET_ALL_TYPES);
    const currentUser = useReactiveVar(currentUserVar);
    const cardRarities = useReactiveVar(cardRaritiesVar);
    const cardCategories = useReactiveVar(cardCategoriesVar);
    const cardTypes = useReactiveVar(cardTypesVar);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
      // If user is logged in, set current user
      currentUserVar(userData?.me || null);
    }, [userData]);

    useEffect(() => {
      cardRaritiesVar(raritiesData?.rarities || null);
    }, [raritiesData]);

    useEffect(() => {
      cardCategoriesVar(categoriesData?.categories || null);
    }, [categoriesData]);

    useEffect(() => {
      cardTypesVar(typesData?.types || null);
    }, [typesData]);

    useEffect(() => {
      if (
        typeof currentUser === 'undefined' ||
        cardRarities?.length ||
        cardCategories?.length ||
        cardTypes?.length
      ) {
        return;
      }

      setIsFetching(false);
    }, [currentUser, cardRarities, cardCategories, cardTypes]);

    if (isFetching) {
      return null;
    }

    return <Component {...hocProps} />;
  };
};
