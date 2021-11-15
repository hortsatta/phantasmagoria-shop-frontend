import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Stack } from '@chakra-ui/react';

import { Input } from 'features/core/components';
import { CardFormData } from './upsert-card-form.component';

export const UpsertCardStep1: FC = () => {
  const { control } = useFormContext<CardFormData>();

  return (
    <Stack spacing={4}>
      <Controller
        name='name'
        control={control}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { ref, ...moreField }, formState: { errors } }) => (
          <Input
            // inputLeftAddonProps={{ w: '100px' }}
            leftComponent='Name'
            error={errors && errors.name?.message}
            {...moreField}
          />
        )}
      />
    </Stack>
  );
};
