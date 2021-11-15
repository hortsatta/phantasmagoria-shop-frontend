import { FC } from 'react';
import { Flex, FlexProps } from '@chakra-ui/react';

import variables from 'assets/styles/_variables.module.scss';

export const Surface: FC<FlexProps> = ({ children, ...moreProps }) => (
  <Flex
    backgroundColor={variables.surfaceColor}
    borderColor='rgba(255,255,255,0.06)'
    borderWidth='1px'
    borderRadius={8}
    overflow='hidden'
    {...moreProps}
  >
    {children}
  </Flex>
);
