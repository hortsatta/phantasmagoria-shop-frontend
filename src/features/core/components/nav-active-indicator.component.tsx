import { FC } from 'react';
import { Box, BoxProps, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { ReactComponent as NavIndicatorSvg } from 'assets/svgs/nav-indicator.svg';
import variables from 'assets/styles/_variables.module.scss';

const MotionBox = motion<Omit<BoxProps, 'transition'>>(Box);

export const NavActiveIndicator: FC = () => (
  <Flex
    justifyContent='center'
    pos='absolute'
    bottom='0px'
    w='20px'
    h='20px'
    transform='translateY(50%)'
    zIndex={1}
  >
    <MotionBox
      pos='relative'
      w='100%'
      h='100%'
      backgroundColor={variables.backgroundColor}
      borderRadius='999px'
      zIndex={1}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'tween', duration: 0.2 }}
    >
      <NavIndicatorSvg fill={variables.primaryColor} />
    </MotionBox>
    <Box
      background={`linear-gradient(90deg, rgba(0,0,0,0) 0%, ${variables.primaryColor} 20%, ${variables.primaryColor} 80%, rgba(0,0,0,0) 100%)`}
      pos='absolute'
      top='10px'
      w='200px'
      h='2px'
    />
  </Flex>
);

NavActiveIndicator.defaultProps = {
  active: false
};
