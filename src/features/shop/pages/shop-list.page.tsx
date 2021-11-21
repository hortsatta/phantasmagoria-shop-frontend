import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, ButtonGroup, Container, Divider, Flex } from '@chakra-ui/react';
import { PlusCircle, StackSimple } from 'phosphor-react';

import { Icon, navConfig, PageBox } from 'features/core/components';
import { ShopItem } from '../components';

import tempData from '../data-temp.json';

export const ShopListPage: FC = () => {
  const history = useHistory();
  const addCardPath = `${navConfig.card.path}${navConfig.card.children?.add.path}`;

  return (
    <PageBox display='flex' alignItems='flex-start' h='100%' flex='1'>
      <Box flex={1} />
      <Flex minH='100vh' pos='relative' alignItems='flex-start'>
        <Divider pos='absolute' h='100%' orientation='vertical' />
        <Container p={8} maxW='7xl'>
          <Flex px={8} pb={4} justifyContent='flex-end'>
            <ButtonGroup variant='ghost' size='sm' isAttached>
              <Button leftIcon={<Icon w={7} as={PlusCircle} />}>Add Item</Button>
              <Divider mx={4} opacity={0.2} orientation='vertical' />
              <Button
                leftIcon={<Icon w={7} as={StackSimple} />}
                onClick={() => history.push(addCardPath)}
              >
                Add New Card
              </Button>
            </ButtonGroup>
          </Flex>
          <Flex flex={1} alignItems='flex-start' justifyContent='center' flexWrap='wrap'>
            {tempData.map(item => (
              <ShopItem key={item.id} item={item} />
            ))}
          </Flex>
        </Container>
        <Divider pos='absolute' right='0px' h='100%' orientation='vertical' />
      </Flex>
      <Box flex={1} />
    </PageBox>
  );
};
