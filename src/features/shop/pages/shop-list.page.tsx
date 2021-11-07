import { FC } from 'react';
import { Box, Divider, Flex, Image } from '@chakra-ui/react';

import { PageBox } from 'features/core/components';

import variables from 'assets/styles/_variables.module.scss';

import tempData from '../data-temp.json';

export const ShopListPage: FC = () => (
  <PageBox display='flex' alignItems='flex-start' h='100%' flex='1'>
    <Box flex={1} />
    <Flex minH='100vh' pos='relative' alignItems='flex-start'>
      <Divider pos='absolute' h='100%' opacity={0.06} orientation='vertical' />
      <Flex alignItems='flex-start' justifyContent='center' flexWrap='wrap' p={8} w='7xl'>
        {tempData.map(item => (
          <Flex
            key={item.id}
            justifyContent='center'
            alignItems='center'
            m={4}
            p={3}
            w='272px'
            h='380px'
            backgroundColor={variables.surfaceColor}
            borderRadius={12}
          >
            <Image src={item.image} backgroundColor='rgba(0,0,0,0.3)' />
          </Flex>
        ))}
      </Flex>
      <Divider pos='absolute' right='0px' h='100%' opacity={0.06} orientation='vertical' />
    </Flex>
    <Box flex={1} />
  </PageBox>
);
