import { useEffect, useMemo } from 'react';
import { useLazyQuery } from '@apollo/client';

import { PhBarangay, SelectOption } from 'models';
import { GET_PH_BARANGAYS } from 'services/graphql';

type Result = {
  phLocBarangays: PhBarangay[];
  phBarangayOptions: SelectOption[];
  loading: boolean;
};

export const usePhLocationBarangay = (cityCode: string): Result => {
  // Graphql lazy queries for province, city/municipalities, and barangays.
  // Use lazy query to query only when code value changes.
  const [getPhLocBarangays, { data: { phLocBarangays = [] } = {}, loading }] =
    useLazyQuery(GET_PH_BARANGAYS);
  // Generate options using useMemo hook to memoized values
  // and prevent unnecessary rerenders.
  const phBarangayOptions = useMemo(
    () => phLocBarangays?.map(({ code, name }: PhBarangay) => ({ value: code, label: name })) || [],
    [phLocBarangays]
  );
  // Invoke lazy query when specific code change
  useEffect(() => {
    if (!cityCode) {
      return;
    }
    getPhLocBarangays({ variables: { municipalityCode: cityCode } });
  }, [cityCode]);

  return { phLocBarangays, phBarangayOptions, loading };
};
