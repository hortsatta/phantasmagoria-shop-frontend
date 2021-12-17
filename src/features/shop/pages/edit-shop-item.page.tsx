import { FC, useContext, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { Center, Heading } from '@chakra-ui/react';

import { appModulesVar } from 'config';
import { PageContext } from 'features/core/contexts';
import { PageBox } from 'features/core/components';
import { UpsertCardProductForm } from 'features/card/components';
import { useEditShopItem } from '../hooks';

export const EditShopItemPage: FC = () => {
  const { changePage } = useContext(PageContext);
  const { slug } = useParams<any>();
  const { currentItem, loading, isComplete, updateItem, removeItem } = useEditShopItem(slug || '');
  const appModules: any = useReactiveVar(appModulesVar);
  const headingText = useMemo(() => `Update ${currentItem?.name || ''} Item`, [currentItem]);

  // Redirect to main shop page if process is fully complete.
  useEffect(() => {
    if (!isComplete) {
      return;
    }

    const delay = setTimeout(() => {
      changePage(appModules.shop.children?.list.key, appModules.shop.path, false, {
        refetch: true
      });
    }, 1800);

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(delay);
  }, [isComplete]);

  return (
    <PageBox pt={8}>
      <Center mb={6}>
        <Heading as='h2' fontSize='4xl'>
          {headingText}
        </Heading>
      </Center>
      {currentItem && (
        <UpsertCardProductForm
          m='0 auto'
          maxW='4xl'
          w='100%'
          cardProduct={currentItem}
          loading={loading}
          isComplete={isComplete}
          onSubmit={updateItem}
          onRemove={removeItem}
        />
      )}
    </PageBox>
  );
};
