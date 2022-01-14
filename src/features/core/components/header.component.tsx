import { FC } from 'react';
import { Box, Divider, Flex, Heading } from '@chakra-ui/react';

import { Nav } from './nav.component';
import { ReactComponent as LogoSvg } from 'assets/svgs/logo.svg';

import variables from 'assets/styles/_variables.module.scss';

export const Header: FC = () => (
  <Box pos='fixed' top='0px' w='100%' bgColor={variables.bgColor} zIndex={3}>
    <Flex
      justifyContent='space-between'
      alignItems='center'
      pos='relative'
      px={6}
      w='100%'
      h='60px'
      zIndex={1}
    >
      <Flex alignItems='center' h='100%'>
        <LogoSvg width={270} fill='#fff' />
        <Heading pos='absolute' as='h1' hidden>
          Phantasmagoria Shop
        </Heading>
      </Flex>
      <Nav />
      <Box />
    </Flex>
    <Divider opacity={0.3} />
  </Box>
);
