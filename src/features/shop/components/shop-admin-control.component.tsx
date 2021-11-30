import { FC, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { Button, VStack } from '@chakra-ui/react';
import { PlusCircle, StackSimple } from 'phosphor-react';

import { appModulesVar } from 'config';
import { Icon } from 'features/core/components';

export const ShopAdminControl: FC = () => {
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
    <VStack flexDir='column' alignItems='flex-start' spacing={4}>
      <Button
        variant='ghost'
        size='sm'
        leftIcon={<Icon w={7} as={PlusCircle} />}
        onClick={() => history.push(addShopItemPath)}
      >
        Add Item
      </Button>
      <Button
        variant='ghost'
        size='sm'
        leftIcon={<Icon w={7} as={StackSimple} />}
        onClick={() => history.push(addCardPath)}
      >
        Add New Card
      </Button>
    </VStack>
  );
};
