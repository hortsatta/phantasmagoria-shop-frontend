import { FC, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { Center, Heading } from '@chakra-ui/react';

import { appModulesVar } from 'config';
import { PageBox } from 'features/core/components';
import { useEditCard } from '../hooks';
import { UpsertCardForm } from '../components';

export const EditCardPage: FC = () => {
  const history = useHistory();
  const { slug } = useParams<any>();
  const { currentCard, loading, isComplete, updateCard, removeCard } = useEditCard(slug || '');
  const appModules: any = useReactiveVar(appModulesVar);
  const headingText = useMemo(() => `Update ${currentCard?.name || ''} Card`, [currentCard]);

  // Redirect to main shop page if process is fully complete.
  useEffect(() => {
    if (!isComplete) {
      return undefined;
    }

    const delay = setTimeout(() => {
      const cardListPath = `${appModules.admin.path}${appModules.card.path}`;
      history.push(cardListPath, { refetch: true });
    }, 1800);

    return () => {
      clearTimeout(delay);
    };
  }, [isComplete]);

  return (
    <PageBox pt={8} pageTitle={headingText} pageDescription='Update card'>
      <Center mb={6}>
        <Heading as='h2' fontSize='4xl'>
          {headingText}
        </Heading>
      </Center>
      {currentCard && (
        <UpsertCardForm
          m='0 auto'
          maxW='4xl'
          w='100%'
          card={currentCard}
          loading={loading}
          isComplete={isComplete}
          onSubmit={updateCard}
          onRemove={removeCard}
        />
      )}
    </PageBox>
  );
};
