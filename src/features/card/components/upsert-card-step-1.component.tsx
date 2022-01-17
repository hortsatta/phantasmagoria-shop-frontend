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
        render={({ field: { onChange, onBlur, value, name }, formState: { errors } }) => (
          <Input
            inputLeftAddonProps={{ w: LABEL_WIDTH }}
            leftComponent='Name'
            error={errors && errors.name?.message}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
      />
      <Controller
        name='description'
        control={control}
        render={({ field: { onChange, onBlur, value, name }, formState: { errors } }) => (
          <Input
            inputLeftAddonProps={{ w: LABEL_WIDTH }}
            leftComponent='Description'
            error={errors && errors.description?.message}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
      />
      <FormSectionHeading pb={0}>Attributes</FormSectionHeading>
      <HStack spacing={4}>
        <Controller
          name='offense'
          control={control}
          render={({ field: { onChange, onBlur, value, name }, formState: { errors } }) => (
            <NumberInput
              inputLeftAddonProps={{ w: LABEL_WIDTH }}
              leftComponent='Offense'
              error={errors && errors.offense?.message}
              name={name}
              value={value}
              onBlur={onBlur}
              onChange={val => onChange(!val.trim() ? 0 : parseInt(val, 10))}
            />
          )}
        />
        <Controller
          name='defense'
          control={control}
          render={({ field: { onChange, onBlur, value, name }, formState: { errors } }) => (
            <NumberInput
              inputLeftAddonProps={{ w: LABEL_WIDTH }}
              leftComponent='Defense'
              error={errors && errors.defense?.message}
              name={name}
              value={value}
              onBlur={onBlur}
              onChange={val => onChange(!val.trim() ? 0 : parseInt(val, 10))}
            />
          )}
        />
        <Controller
          name='cost'
          control={control}
          render={({ field: { onChange, onBlur, value, name }, formState: { errors } }) => (
            <NumberInput
              inputLeftAddonProps={{ w: LABEL_WIDTH }}
              leftComponent='Cost'
              error={errors && errors.cost?.message}
              name={name}
              value={value}
              onBlur={onBlur}
              onChange={val => onChange(!val.trim() ? 0 : parseInt(val, 10))}
            />
          )}
        />
      </HStack>
      <FormSectionHeading pb={0}>Properties</FormSectionHeading>
      <HStack spacing={4}>
        <Controller
          name='rarity'
          control={control}
          render={({ field: { onChange, onBlur, value, name }, formState: { errors } }) => (
            <Select
              inputLeftAddonProps={{ w: LABEL_WIDTH }}
              leftComponent='Rarity'
              options={cardRarityOptions}
              name={name}
              value={cardRarityOptions.find(item => item.value === value) || { value: 0 }}
              onBlur={onBlur}
              onChange={(val: any) => onChange(val.value)}
              error={errors && errors.cost?.message}
            />
          )}
        />
        <Controller
          name='category'
          control={control}
          render={({ field: { onChange, onBlur, value, name }, formState: { errors } }) => (
            <Select
              inputLeftAddonProps={{ w: LABEL_WIDTH }}
              leftComponent='Category'
              options={cardCategoryOptions}
              name={name}
              value={cardCategoryOptions.find(item => item.value === value) || { value: 0 }}
              onBlur={onBlur}
              onChange={(val: any) => onChange(val.value)}
              error={errors && errors.cost?.message}
            />
          )}
        />
      </HStack>
      <Controller
        name='types'
        control={control}
        render={({ field: { onChange, onBlur, value, name }, formState: { errors } }) => (
          <Select
            inputLeftAddonProps={{ w: LABEL_WIDTH }}
            leftComponent='Types'
            options={cardTypeOptions}
            name={name}
            value={cardTypeOptions.filter(item => value.find(v => v === item.value))}
            onBlur={onBlur}
            onChange={(val: any) => onChange(val.map((item: any) => item.value))}
            error={errors && errors.cost?.message}
            isMulti
          />
        )}
      />
    </Stack>
  );
};
