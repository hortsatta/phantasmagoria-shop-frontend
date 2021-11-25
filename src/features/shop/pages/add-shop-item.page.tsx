import { FC, useContext, useEffect, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Center, Heading } from '@chakra-ui/react';

import { appModulesVar } from 'config';
import { PageContext } from 'features/core/contexts';
import { useDebounce } from 'features/core/hooks';
import { PageBox } from 'features/core/components';
import { UpsertCardProductForm } from 'features/card/components';

export const AddShopItemPage: FC = () => {
  const { changePage } = useContext(PageContext);
  const { debounce, loading: debounceLoading } = useDebounce();
  const appModules: any = useReactiveVar(appModulesVar);
  const [isComplete, setIsComplete] = useState(false);

  // Redirect to main shop page if process is fully complete.
  useEffect(() => {
    if (!isComplete) {
      return;
    }

    const shopListNav = appModules.shop.children?.list;
    changePage(shopListNav?.key, shopListNav?.path);
  }, [isComplete]);

  const handleSubmit = () => {
    debounce();
  };

  return (
    <PageBox pt={8}>
      <Center mb={6}>
        <Heading as='h2' fontSize='4xl'>
          Add New Item
        </Heading>
      </Center>
      <UpsertCardProductForm
        m='0 auto'
        maxW='4xl'
        w='100%'
        onSubmit={handleSubmit}
        // loading={debounceLoading || createCardLoading || updateCardLoading || uploadLoading}
        isComplete={isComplete}
      />
    </PageBox>
  );
};
