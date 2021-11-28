import { FC, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, Stack } from '@chakra-ui/react';

import { FormSectionHeading, ImageUpload, Input, NumberInput } from 'features/core/components';
import { CardProductFormData } from './upsert-card-product-form.component';

const LABEL_WIDTH = '117px';

export const UpsertCardProductStep2: FC = () => {
  const { control, setValue, watch } = useFormContext<CardProductFormData>();
  const price = watch('price');

  const handlePriceBlur = useCallback(
    (onBlur: any) => {
      onBlur();
      setValue('price', parseFloat(price.toString()));
    },
    [price]
  );

  return (
    <Stack flex={1} spacing={4}>
      <Controller
        name='name'
        control={control}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { ref, ...moreFields }, formState: { errors } }) => (
          <Input
            inputLeftAddonProps={{ w: LABEL_WIDTH }}
            leftComponent='Name'
            error={errors && errors.name?.message}
            {...moreFields}
          />
        )}
      />
      <Controller
        name='description'
        control={control}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { ref, ...moreFields }, formState: { errors } }) => (
          <Input
            inputLeftAddonProps={{ w: LABEL_WIDTH }}
            leftComponent='Description'
            error={errors && errors.description?.message}
            {...moreFields}
          />
        )}
      />
      <Box w='50%'>
        <Controller
          name='price'
          control={control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { ref, onChange, onBlur, ...moreFields }, formState: { errors } }) => (
            <NumberInput
              inputLeftAddonProps={{ w: LABEL_WIDTH }}
              leftComponent='Unit Price'
              error={errors && errors.price?.message}
              onChange={onChange}
              onBlur={() => handlePriceBlur(onBlur)}
              {...moreFields}
            />
          )}
        />
      </Box>
      <Box pt={4} flex={1}>
        <FormSectionHeading>Item Image</FormSectionHeading>
        <Controller
          name='image'
          control={control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { name, value, onChange } }) => (
            <ImageUpload
              name={name}
              value={value}
              onChange={onChange}
              imagePreviewHeight={300}
              acceptedFileTypes={['image/png', 'image/jpeg']}
            />
          )}
        />
      </Box>
    </Stack>
  );
};
