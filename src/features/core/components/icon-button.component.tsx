import { ComponentProps, FC } from 'react';
import { IconButton as ChIconButton, IconButtonProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import variables from 'assets/styles/_variables.module.scss';

const MotionChIconButton = motion<Omit<IconButtonProps, 'transition'>>(ChIconButton);

const IconButton: FC<IconButtonProps> = props => (
  <ChIconButton
    color='rgba(255,255,255,0.7)'
    _hover={{ color: variables.primaryColor }}
    _active={{ color: variables.primaryColor }}
    _focus={{ boxShadow: 0 }}
    variant='unstyled'
    {...props}
  />
);

const MotionIconButton: FC<ComponentProps<typeof MotionChIconButton>> = props => (
  <MotionChIconButton
    color='rgba(255,255,255,0.7)'
    _hover={{ color: variables.primaryColor }}
    _active={{ color: variables.primaryColor }}
    _focus={{ boxShadow: 0 }}
    variant='unstyled'
    {...props}
  />
);

export { IconButton, MotionIconButton };
