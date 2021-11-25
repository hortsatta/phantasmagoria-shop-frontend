import { FC, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { Box, Button, ButtonGroup, Container, Divider, Flex } from '@chakra-ui/react';
import { PlusCircle, StackSimple } from 'phosphor-react';

import { CardProduct } from 'models';
import { appModulesVar } from 'config';
import { Icon, PageBox } from 'features/core/components';
import { ShopItem } from '../components';

import tempData from '../data-temp.json';

export const ShopListPage: FC = () => {
  const history = useHistory();
  const appModules: any = useReactiveVar(appModulesVar);

  const addCardPath = useMemo(
    () => `${appModules.card.path}${appModules.card.children?.add.path}`,
    [appModules]
  );

  const addShopItemPath = useMemo(
    () => `${appModules.shop.path}${appModules.shop.children?.add.path}`,
    [appModules]
  );

  return (
    <PageBox display='flex' alignItems='flex-start' h='100%' flex='1'>
      <Box flex={1} />
      <Flex minH='100vh' pos='relative' alignItems='flex-start'>
        <Divider pos='absolute' h='100%' orientation='vertical' />
        <Container p={8} maxW='7xl'>
          <Flex px={8} pb={4} justifyContent='flex-end'>
            <ButtonGroup variant='ghost' size='sm' isAttached>
              <Button
                leftIcon={<Icon w={7} as={PlusCircle} />}
                onClick={() => history.push(addShopItemPath)}
              >
                Add Item
              </Button>
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
            {tempData.map((item: CardProduct) => (
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
