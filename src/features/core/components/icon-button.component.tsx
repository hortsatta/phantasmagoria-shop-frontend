import { ComponentProps, FC } from 'react';
import { IconButton as ChIconButton, IconButtonProps, Tooltip } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import variables from 'assets/styles/_variables.module.scss';

type Props = IconButtonProps & {
  tooltip?: string;
};

const OPEN_DELAY = 800;
const CLOSE_DELAY = 400;

const MotionChIconButton = motion<Omit<Props, 'transition'>>(ChIconButton);

const buttonProps = {
  color: 'rgba(255,255,255,0.7)',
  _hover: { bgColor: variables.hoverBgColor },
  _active: { color: variables.primaryColor },
  _focus: { boxShadow: 0 },
  variant: 'unstyled'
};

const IconButton: FC<Props> = ({ tooltip, ...moreProps }) => (
  <Tooltip label={tooltip} openDelay={OPEN_DELAY} closeDelay={CLOSE_DELAY}>
    <ChIconButton {...buttonProps} {...moreProps} />
  </Tooltip>
);

const MotionIconButton: FC<ComponentProps<typeof MotionChIconButton>> = ({
  tooltip,
  ...moreProps
}) => (
  <Tooltip label={tooltip} openDelay={OPEN_DELAY} closeDelay={CLOSE_DELAY}>
    <MotionChIconButton {...buttonProps} {...moreProps} />
  </Tooltip>
);

IconButton.defaultProps = { tooltip: '' };

export { IconButton, MotionIconButton };
