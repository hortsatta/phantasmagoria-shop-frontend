import { FC, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { Box, Button, ButtonGroup, ButtonProps, Text, TextProps, VStack } from '@chakra-ui/react';
import { PlusCircle, StackSimple } from 'phosphor-react';

import { appModulesVar } from 'config';
import { Icon } from 'features/core/components';

const sectionHeaderStyles: TextProps = {
  mb: 2,
  color: 'rgba(255,255,255,0.7)',
  fontSize: 13,
  textTransform: 'uppercase'
};

const buttonStyles: ButtonProps = {
  justifyContent: { '2xl': 'center', xl: 'flex-start', base: 'flex-start' },
  w: { '2xl': 'auto', base: '100%' },
  variant: 'ghost',
  size: 'sm'
};

export const ShopAdminControl: FC = () => {
  const history = useHistory();
  const appModules: any = useReactiveVar(appModulesVar);

  const addCardPath = useMemo(
    () => `${appModules.admin.path}${appModules.card.path}${appModules.card.children?.add.path}`,
    [appModules]
  );

  const cardListPath = useMemo(
    () => `${appModules.admin.path}${appModules.card.path}${appModules.card.children?.list.path}`,
    [appModules]
  );

  const addShopItemPath = useMemo(
    () => `${appModules.admin.path}${appModules.shop.path}${appModules.shop.children?.add.path}`,
    [appModules]
  );

  return (
    <VStack alignItems='flex-start'>
      <Box w='100%'>
        <Text {...sectionHeaderStyles}>Shop Item</Text>
        <Button
          {...buttonStyles}
          leftIcon={<Icon w={7} as={PlusCircle} />}
          onClick={() => history.push(addShopItemPath)}
        >
          Add New
        </Button>
      </Box>
      <Box w='100%'>
        <Text {...sectionHeaderStyles}>Card</Text>
        <ButtonGroup
          w={{ '2xl': 'auto', base: '100%' }}
          flexDir={{ '2xl': 'row', base: 'column' }}
          isAttached
        >
          <Button
            {...buttonStyles}
            mb={{ '2xl': 0, base: 2 }}
            leftIcon={<Icon w={7} as={PlusCircle} />}
            onClick={() => history.push(addCardPath)}
          >
            Add New
          </Button>
          <Button
            {...buttonStyles}
            leftIcon={<Icon w={7} as={StackSimple} />}
            onClick={() => history.push(cardListPath)}
          >
            View Cards
          </Button>
        </ButtonGroup>
      </Box>
    </VStack>
  );
};
