import { useMemo } from 'react';
import { useReactiveVar } from '@apollo/client';

import { phRegionsVar } from 'config';
import { PhRegion, SelectOption } from 'models';

type Result = {
  phRegionOptions: SelectOption[];
  phLocRegions?: PhRegion[] | null;
};

export const usePhLocationRegion = (): Result => {
  // Get cached ph regions/island groups
  const phLocRegions = useReactiveVar(phRegionsVar);

  const phRegionOptions = useMemo(
    () => phLocRegions?.map(({ code, name }: PhRegion) => ({ value: code, label: name })) || [],
    [phLocRegions]
  );

  return { phLocRegions, phRegionOptions };
};
