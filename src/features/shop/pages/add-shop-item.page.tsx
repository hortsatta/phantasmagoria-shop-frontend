import { FC, useContext, useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Center, Heading } from '@chakra-ui/react';

import { appModulesVar } from 'config';
import { PageContext } from 'features/core/contexts';
import { PageBox } from 'features/core/components';
import { UpsertCardProductForm } from 'features/card/components';
import { useAddShopItem } from '../hooks';

export const AddShopItemPage: FC = () => {
  const { changePage } = useContext(PageContext);
  const { isComplete, loading, addShopItem } = useAddShopItem();
  const appModules: any = useReactiveVar(appModulesVar);

  // Redirect to main shop page if process is fully complete.
  useEffect(() => {
    if (!isComplete) {
      return undefined;
    }

    const delay = setTimeout(() => {
      changePage(appModules.shop.children?.list.key, appModules.shop.path, false);
    }, 1800);

    return () => {
      clearTimeout(delay);
    };
  }, [isComplete]);

  return (
    <PageBox pt={8} pageTitle='Add Item' pageDescription='Add new shop item.'>
      <Center mb={6}>
        <Heading as='h2' fontSize='4xl'>
          Conjure New Item
        </Heading>
      </Center>
      <UpsertCardProductForm
        m='0 auto'
        maxW='4xl'
        w='100%'
        onSubmit={addShopItem}
        loading={loading}
        isComplete={isComplete}
      />
    </PageBox>
  );
};
