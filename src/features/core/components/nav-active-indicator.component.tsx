import { FC } from 'react';
import { Box, BoxProps, Flex } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import { ReactComponent as NavIndicatorSvg } from 'assets/svgs/nav-indicator.svg';
import variables from 'assets/styles/_variables.module.scss';

const MotionBox = motion<Omit<BoxProps, 'transition'>>(Box);

type Props = {
  loading: boolean;
  active?: boolean;
};

export const NavActiveIndicator: FC<Props> = ({ active, loading }) => (
  <Flex
    justifyContent='center'
    pos='absolute'
    bottom='0px'
    w='20px'
    h='20px'
    transform='translateY(50%)'
    zIndex={1}
  >
    {active && (
      <>
        <MotionBox
          pos='relative'
          w='100%'
          h='100%'
          bgColor={variables.bgColor}
          borderRadius='999px'
          zIndex={1}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'tween', duration: 0.25 }}
        >
          <NavIndicatorSvg fill={variables.primaryColor} />
        </MotionBox>
        <MotionBox
          background={`linear-gradient(90deg, rgba(0,0,0,0) 0%, ${variables.primaryColor} 20%, ${variables.primaryColor} 80%, rgba(0,0,0,0) 100%)`}
          pos='absolute'
          top='10px'
          h='2px'
          initial={{ width: '0px' }}
          animate={{ width: '200px' }}
          transition={{ type: 'tween', ease: 'easeIn', duration: 0.3, delay: 0.12 }}
        />
        <AnimatePresence>
          {loading && (
            <MotionBox
              background={`linear-gradient(90deg, rgba(0,0,0,0) 0%, ${variables.primaryColor} 20%, ${variables.primaryColor} 80%, rgba(0,0,0,0) 100%)`}
              pos='absolute'
              top='10px'
              h='2px'
              animate={{ width: ['200px', '400px'], opacity: [0, 1] }}
              transition={{
                width: { repeat: Infinity, repeatType: 'mirror', duration: 0.4 },
                default: { delay: 0.42, type: 'tween', ease: 'easeIn', duration: 0.1 }
              }}
              exit={{ width: '0px', transition: { duration: 1 } }}
            />
          )}
        </AnimatePresence>
      </>
    )}
  </Flex>
);

NavActiveIndicator.defaultProps = {
  active: false
};
