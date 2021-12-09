import { useEffect, useMemo } from 'react';
import { useLazyQuery } from '@apollo/client';

import { PhProvince, SelectOption } from 'models';
import { GET_PH_PROVINCES } from 'services/graphql';

type Result = {
  phLocProvinces: PhProvince[];
  phProvinceOptions: SelectOption[];
  loading: boolean;
};

export const usePhLocationProvince = (regionCode: string): Result => {
  // Graphql lazy queries for province, city/municipalities, and barangays.
  // Use lazy query to query only when code value changes.
  const [getPhLocProvinces, { data: { phLocProvinces = [] } = {}, loading }] =
    useLazyQuery(GET_PH_PROVINCES);
  // Generate options using useMemo hook to memoized values
  // and prevent unnecessary rerenders.
  const phProvinceOptions = useMemo(
    () => phLocProvinces?.map(({ code, name }: PhProvince) => ({ value: code, label: name })) || [],
    [phLocProvinces]
  );
  // Invoke lazy query when specific code change
  useEffect(() => {
    if (!regionCode) {
      return;
    }
    getPhLocProvinces({ variables: { regionCode } });
  }, [regionCode]);

  return { phLocProvinces, phProvinceOptions, loading };
};
