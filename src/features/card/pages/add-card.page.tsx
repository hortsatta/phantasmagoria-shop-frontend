import { FC } from 'react';

import { PageBox } from 'features/core/components';
import { UpsertCardForm } from '../components';

export const AddCardPage: FC = () => {
  const handleSubmit = () => {
    console.log('submit');
  };

  return (
    <PageBox pt={8}>
      <UpsertCardForm m='0 auto' maxW='5xl' w='100%' onSubmit={handleSubmit} />
    </PageBox>
  );
};
