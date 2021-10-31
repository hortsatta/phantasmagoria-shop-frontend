import { FC } from 'react';
import { Box, Flex } from '@chakra-ui/react';

import { ReactComponent as NavIndicatorSvg } from 'assets/svgs/nav-indicator.svg';
import variables from 'assets/styles/_variables.module.scss';

type Props = {
  active?: boolean;
};

export const NavIndicator: FC<Props> = ({ active }) => (
  <Flex
    justifyContent='center'
    pos='absolute'
    bottom='0px'
    w='20px'
    h='20px'
    transform='translateY(50%)'
    zIndex={1}
    opacity={active ? 1 : 0}
  >
    <Box
      pos='relative'
      w='100%'
      h='100%'
      backgroundColor={variables.backgroundColor}
      borderRadius='999px'
      transform={active ? 'scale(1)' : 'scale(0)'}
      transition='transform 0.3s'
      zIndex={1}
    >
      <NavIndicatorSvg fill={variables.primaryColor} />
    </Box>
    <Box
      background={`linear-gradient(90deg, rgba(0,0,0,0) 0%, ${variables.primaryColor} 20%, ${variables.primaryColor} 80%, rgba(0,0,0,0) 100%)`}
      pos='absolute'
      top='50%'
      w={active ? '200px' : '0px'}
      h='2px'
      transition='width 0.5s'
    />
  </Flex>
);

NavIndicator.defaultProps = {
  active: false
};
