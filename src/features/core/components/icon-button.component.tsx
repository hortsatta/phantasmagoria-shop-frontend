import { FC } from 'react';
import { IconButton as ChIconButton, IconButtonProps } from '@chakra-ui/react';

import variables from 'assets/styles/_variables.module.scss';

export const IconButton: FC<IconButtonProps> = props => (
  <ChIconButton
    color='rgba(255,255,255,0.7)'
    _hover={{ color: variables.primaryColor }}
    _active={{ color: variables.primaryColor }}
    _focus={{ boxShadow: 0 }}
    variant='unstyled'
    {...props}
  />
);
