import { FC, useContext, useEffect } from 'react';
import { Center, Heading } from '@chakra-ui/react';
import { useReactiveVar } from '@apollo/client';

import { appModulesVar } from 'config';
import { PageContext } from 'features/core/contexts';
import { PageBox } from 'features/core/components';
import { useAddCard } from '../hooks';
import { UpsertCardForm } from '../components';

export const AddCardPage: FC = () => {
  const { changePage } = useContext(PageContext);
  const { isComplete, loading, addCard } = useAddCard();
  const appModules: any = useReactiveVar(appModulesVar);

  // Redirect to main shop page if process is fully complete.
  useEffect(() => {
    if (!isComplete) {
      return;
    }

    const delay = setTimeout(() => {
      const shopListNav = appModules.shop.children?.list;
      changePage(shopListNav?.key, shopListNav?.path);
    }, 1800);

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(delay);
  }, [isComplete]);

  return (
    <PageBox pt={8}>
      <Center mb={6}>
        <Heading as='h2' fontSize='4xl'>
          Conjure New Card
        </Heading>
      </Center>
      <UpsertCardForm
        m='0 auto'
        maxW='4xl'
        w='100%'
        onSubmit={addCard}
        loading={loading}
        isComplete={isComplete}
      />
    </PageBox>
  );
};
