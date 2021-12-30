import { ComponentProps, FC } from 'react';
import { IconButton as ChIconButton, IconButtonProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import variables from 'assets/styles/_variables.module.scss';

const MotionChIconButton = motion<Omit<IconButtonProps, 'transition'>>(ChIconButton);

const buttonProps = {
  color: 'rgba(255,255,255,0.7)',
  _hover: { bgColor: variables.hoverBgColor },
  _active: { color: variables.primaryColor },
  _focus: { boxShadow: 0 },
  variant: 'unstyled'
};

const IconButton: FC<IconButtonProps> = props => <ChIconButton {...buttonProps} {...props} />;

const MotionIconButton: FC<ComponentProps<typeof MotionChIconButton>> = props => (
  <MotionChIconButton {...buttonProps} {...props} />
);

export { IconButton, MotionIconButton };
