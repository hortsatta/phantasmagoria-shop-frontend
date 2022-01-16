import { ComponentType, useEffect, useState } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';

import {
  appModulesVar,
  cardCategoriesVar,
  cardRaritiesVar,
  cardTypesVar,
  currentUserAccountVar,
  phRegionsVar
} from 'config';
import { signOut } from 'services';
import {
  CHECK_SESSION,
  GET_ALL_CATEGORIES,
  GET_ALL_RARITIES,
  GET_ALL_TYPES,
  GET_APP_MODULES,
  GET_PH_REGIONS
} from 'services/graphql';

export const withPrerequisite = <T,>(Component: ComponentType<T>) => {
  return (hocProps: T) => {
    const { data: userAccountData, loading: checkSessionLoading } = useQuery(CHECK_SESSION);
    const { data: appModulesData } = useQuery(GET_APP_MODULES);
    const { data: raritiesData } = useQuery(GET_ALL_RARITIES);
    const { data: categoriesData } = useQuery(GET_ALL_CATEGORIES);
    const { data: typesData } = useQuery(GET_ALL_TYPES);
    const { data: phRegionsData } = useQuery(GET_PH_REGIONS);
    const appModules = useReactiveVar(appModulesVar);
    const currentUserAccount = useReactiveVar(currentUserAccountVar);
    const cardRarities = useReactiveVar(cardRaritiesVar);
    const cardCategories = useReactiveVar(cardCategoriesVar);
    const cardTypes = useReactiveVar(cardTypesVar);
    // const phRegions = useReactiveVar(phRegionsVar);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
      // If user is logged in, set current user
      const { userAccount } = userAccountData?.me.user || {};
      currentUserAccountVar(userAccount || null);
      !userAccountData && !checkSessionLoading && signOut(true);
    }, [userAccountData, checkSessionLoading]);

    useEffect(() => {
      appModulesVar(appModulesData?.appModules.modules || null);
    }, [appModulesData]);

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
      phRegionsVar(phRegionsData?.phLocRegions || null);
    }, [phRegionsData]);

    useEffect(() => {
      if (
        !appModules ||
        typeof currentUserAccount === 'undefined' ||
        typeof cardRarities === 'undefined' ||
        typeof cardCategories === 'undefined' ||
        typeof cardTypes === 'undefined'
      ) {
        return;
      }

      setIsFetching(false);
    }, [currentUserAccount, appModules, cardRarities, cardCategories, cardTypes]);

    if (isFetching) {
      return null;
    }

    return <Component {...hocProps} />;
  };
};
