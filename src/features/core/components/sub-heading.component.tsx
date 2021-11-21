import { FC } from 'react';
import { Text, TextProps } from '@chakra-ui/react';

import variables from 'assets/styles/_variables.module.scss';

export const SubHeading: FC<TextProps> = ({ children, ...moreProps }) => (
  <Text fontFamily={variables.primaryFont} fontSize={28} lineHeight={1} {...moreProps}>
    {children}
  </Text>
);
