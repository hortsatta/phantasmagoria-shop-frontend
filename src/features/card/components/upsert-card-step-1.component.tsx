import { FC, useMemo } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Controller, useFormContext } from 'react-hook-form';
import { Stack, HStack } from '@chakra-ui/react';

import { cardCategoriesVar, cardRaritiesVar, cardTypesVar } from 'config';
import { CardCategory, CardRarity, CardType } from 'models';
import { FormSectionHeading, Input, NumberInput, Select } from 'features/core/components';
import { CardFormData } from './upsert-card-form.component';

const LABEL_WIDTH = '117px';

export const UpsertCardStep1: FC = () => {
  const { control } = useFormContext<CardFormData>();
  const cardRarities = useReactiveVar(cardRaritiesVar);
  const cardCategories = useReactiveVar(cardCategoriesVar);
  const cardTypes = useReactiveVar(cardTypesVar);

  const cardRarityOptions = useMemo(
    () =>
      cardRarities?.map(({ id, name }: CardRarity) => ({ value: parseInt(id, 10), label: name })) ||
      [],
    [cardRarities]
  );

  const cardCategoryOptions = useMemo(
    () =>
      cardCategories?.map(({ id, name }: CardCategory) => ({
        value: parseInt(id, 10),
        label: name
      })) || [],
    [cardCategories]
  );

  const cardTypeOptions = useMemo(
    () =>
      cardTypes?.map(({ id, name }: CardType) => ({ value: parseInt(id, 10), label: name })) || [],
    [cardTypes]
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
      <FormSectionHeading pb={0}>Attributes</FormSectionHeading>
      <HStack spacing={4}>
        <Controller
          name='offense'
          control={control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { ref, onChange, ...moreFields }, formState: { errors } }) => (
            <NumberInput
              inputLeftAddonProps={{ w: LABEL_WIDTH }}
              leftComponent='Offense'
              error={errors && errors.offense?.message}
              onChange={val => onChange(!val.trim() ? 0 : parseInt(val, 10))}
              {...moreFields}
            />
          )}
        />
        <Controller
          name='defense'
          control={control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { ref, onChange, ...moreFields }, formState: { errors } }) => (
            <NumberInput
              inputLeftAddonProps={{ w: LABEL_WIDTH }}
              leftComponent='Defense'
              error={errors && errors.defense?.message}
              onChange={val => onChange(!val.trim() ? 0 : parseInt(val, 10))}
              {...moreFields}
            />
          )}
        />
        <Controller
          name='cost'
          control={control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { ref, onChange, ...moreFields }, formState: { errors } }) => (
            <NumberInput
              inputLeftAddonProps={{ w: LABEL_WIDTH }}
              leftComponent='Cost'
              error={errors && errors.cost?.message}
              onChange={val => onChange(!val.trim() ? 0 : parseInt(val, 10))}
              {...moreFields}
            />
          )}
        />
      </HStack>
      <FormSectionHeading pb={0}>Properties</FormSectionHeading>
      <HStack spacing={4}>
        <Controller
          name='rarity'
          control={control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { ref, onChange, value, ...moreFields }, formState: { errors } }) => (
            <Select
              inputLeftAddonProps={{ w: LABEL_WIDTH }}
              leftComponent='Rarity'
              options={cardRarityOptions}
              value={cardRarityOptions.find(item => item.value === value) || { value: 0 }}
              error={errors && errors.cost?.message}
              onChange={(val: any) => onChange(val.value)}
              {...moreFields}
            />
          )}
        />
        <Controller
          name='category'
          control={control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { ref, onChange, value, ...moreFields }, formState: { errors } }) => (
            <Select
              inputLeftAddonProps={{ w: LABEL_WIDTH }}
              leftComponent='Category'
              options={cardCategoryOptions}
              value={cardCategoryOptions.find(item => item.value === value) || { value: 0 }}
              error={errors && errors.cost?.message}
              onChange={(val: any) => onChange(val.value)}
              {...moreFields}
            />
          )}
        />
      </HStack>
      <Controller
        name='types'
        control={control}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { ref, onChange, value, ...moreFields }, formState: { errors } }) => (
          <Select
            inputLeftAddonProps={{ w: LABEL_WIDTH }}
            leftComponent='Types'
            options={cardTypeOptions}
            value={cardTypeOptions.filter(item => value.find(v => v === item.value))}
            error={errors && errors.cost?.message}
            onChange={(val: any) => onChange(val.map((item: any) => item.value))}
            isMulti
            {...moreFields}
          />
        )}
      />
    </Stack>
  );
};
