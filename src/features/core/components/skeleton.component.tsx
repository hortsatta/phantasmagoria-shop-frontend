import { FC } from 'react';
import { Skeleton as ChakraSkeleton, SkeletonProps } from '@chakra-ui/react';

import variables from 'assets/styles/_variables.module.scss';

export const Skeleton: FC<SkeletonProps> = ({ children, ...moreProps }) => (
  <ChakraSkeleton
    startColor={variables.inputBgColor}
    endColor={variables.inputBgFocusColor}
    {...moreProps}
  >
    {children}
  </ChakraSkeleton>
);
