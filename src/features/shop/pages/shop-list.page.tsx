import { FC } from 'react';
import { Box, Flex } from '@chakra-ui/react';

import { Divider, PageBox } from 'features/core/components';
import { ShopItem } from '../components';

import tempData from '../data-temp.json';

export const ShopListPage: FC = () => (
  <PageBox display='flex' alignItems='flex-start' h='100%' flex='1'>
    <Box flex={1} />
    <Flex minH='100vh' pos='relative' alignItems='flex-start'>
      <Divider pos='absolute' h='100%' orientation='vertical' />
      <Flex alignItems='flex-start' justifyContent='center' flexWrap='wrap' p={8} w='7xl'>
        {tempData.map(item => (
          <ShopItem key={item.id} item={item} />
        ))}
      </Flex>
      <Divider pos='absolute' right='0px' h='100%' orientation='vertical' />
    </Flex>
    <Box flex={1} />
  </PageBox>
);
