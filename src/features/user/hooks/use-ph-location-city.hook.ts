import { useEffect, useMemo } from 'react';
import { useLazyQuery } from '@apollo/client';

import { PhCity, SelectOption } from 'models';
import { GET_PH_CITIES } from 'services/graphql';

type Result = {
  phLocCities: PhCity[];
  phCityOptions: SelectOption[];
  loading: boolean;
};

export const usePhLocationCity = (provinceCode: string): Result => {
  // Graphql lazy queries for province, city/municipalities, and barangays.
  // Use lazy query to query only when code value changes.
  const [
    getPhLocMunicipalities,
    { data: { phLocMunicipalities: phLocCities = [] } = {}, loading }
  ] = useLazyQuery(GET_PH_CITIES);
  // Generate options using useMemo hook to memoized values
  // and prevent unnecessary rerenders.
  const phCityOptions = useMemo(
    () => phLocCities?.map(({ code, name }: PhCity) => ({ value: code, label: name })) || [],
    [phLocCities]
  );
  // Invoke lazy query when specific code change
  useEffect(() => {
    if (!provinceCode) {
      return;
    }
    getPhLocMunicipalities({ variables: { provinceCode } });
  }, [provinceCode]);

  return { phLocCities, phCityOptions, loading };
};
