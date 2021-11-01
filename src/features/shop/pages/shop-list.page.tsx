import { Box, Flex } from '@chakra-ui/react';
import { FC } from 'react';

export const ShopListPage: FC = () => (
  <Flex alignItems='flex-start'>
    <Box flex={1} />
    <Flex justifyContent='center' maxW='7xl' w='100%'>
      List Page
    </Flex>
    <Box flex={1} />
  </Flex>
);
