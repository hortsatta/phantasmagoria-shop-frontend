import { FC } from 'react';
import { Box, Divider, Flex } from '@chakra-ui/react';

import { Nav } from './nav.component';
import { ReactComponent as LogoSvg } from 'assets/svgs/logo.svg';

export const Header: FC = () => (
  <>
    <Flex
      justifyContent='space-between'
      alignItems='center'
      pos='relative'
      px='24px'
      w='100%'
      h='60px'
    >
      <Flex alignItems='center' w='270px' h='100%'>
        <LogoSvg />
      </Flex>
      <Nav />
      <Box />
    </Flex>
    <Divider />
  </>
);
