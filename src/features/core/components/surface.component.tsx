import { ComponentProps, FC } from 'react';
import { Flex, FlexProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import variables from 'assets/styles/_variables.module.scss';

const MotionFlex = motion<FlexProps>(Flex);

const Surface: FC<FlexProps> = ({ children, ...moreProps }) => (
  <Flex
    bgColor={variables.surfaceColor}
    borderColor='rgba(255,255,255,0.06)'
    borderWidth='1px'
    borderRadius={8}
    {...moreProps}
  >
    {children}
  </Flex>
);

const MotionSurface: FC<ComponentProps<typeof MotionFlex>> = ({ children, ...moreProps }) => (
  <MotionFlex
    bgColor={variables.surfaceColor}
    borderColor='rgba(255,255,255,0.06)'
    borderWidth='1px'
    borderRadius={8}
    {...moreProps}
  >
    {children}
  </MotionFlex>
);

export { Surface, MotionSurface };
