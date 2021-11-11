import { FC } from 'react';
import { Flex, FlexProps } from '@chakra-ui/react';

import variables from 'assets/styles/_variables.module.scss';

export const Surface: FC<FlexProps> = ({ children, ...moreProps }) => (
  <Flex backgroundColor={variables.surfaceColor} borderRadius={8} overflow='hidden' {...moreProps}>
    {children}
  </Flex>
);
