import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, HStack } from '@chakra-ui/react';

import { FormSectionHeading, ImageUpload } from 'features/core/components';
import { CardFormData } from './upsert-card-form.component';

export const UpsertCardStep2: FC = () => {
  const { control } = useFormContext<CardFormData>();

  return (
    <HStack flex={1} alignItems='flex-start' spacing={4}>
      <Box flex={1}>
        <FormSectionHeading pt={0}>Card Image</FormSectionHeading>
        <Controller
          name='image'
          control={control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { name, value, onChange } }) => (
            <ImageUpload
              name={name}
              value={value}
              onChange={onChange}
              imagePreviewHeight={500}
              acceptedFileTypes={['image/png', 'image/jpeg']}
            />
          )}
        />
      </Box>
      <Box flex={1}>
        <FormSectionHeading pt={0}>Cover Image</FormSectionHeading>
        <Controller
          name='coverImage'
          control={control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { name, value, onChange } }) => (
            <ImageUpload
              name={name}
              value={value}
              onChange={onChange}
              imagePreviewHeight={500}
              acceptedFileTypes={['image/png', 'image/jpeg']}
            />
          )}
        />
      </Box>
    </HStack>
  );
};
