import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Button, ButtonGroup, InputGroupProps, InputAddonProps, VStack } from '@chakra-ui/react';
import { MagicWand } from 'phosphor-react';

import { cardCategoriesVar, cardRaritiesVar, cardTypesVar } from 'config';
import { CardCategory, CardRarity, CardType } from 'models';
import { Icon, Select } from 'features/core/components';

type Props = {
  value?: any;
  loading?: boolean;
  onChange?: (val: any) => void;
};

const inputGroupProps: InputGroupProps = {
  flexDir: 'column',
  bgColor: 'none'
};

const inputLeftAddonProps: InputAddonProps = {
  pb: 2,
  h: 'auto',
  minH: 'auto',
  bg: 'none',
  bgColor: 'none'
};

const inputLeftAddonWrapperProps: InputAddonProps = {
  p: 0,
  bgColor: 'none'
};

const filterDefaultValues = { rarities: [], categories: [], types: [] };

export const ShopItemFilters: FC<Props> = ({ value, loading, onChange }) => {
  const cardRarities = useReactiveVar(cardRaritiesVar);
  const cardCategories = useReactiveVar(cardCategoriesVar);
  const cardTypes = useReactiveVar(cardTypesVar);
  const [filters, setFilters] = useState<any>(filterDefaultValues);

  useEffect(() => {
    const { rarities, categories, types } = value || filterDefaultValues;
    setFilters({ rarities, categories, types });
  }, [value]);

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

  const handleChange = useCallback(
    (val: any, name: string) => {
      const targetFilter = val.map((v: any) => v.value);
      setFilters({ ...filters, [name]: targetFilter });
    },
    [filters, setFilters]
  );

  const handleClear = useCallback(() => {
    setFilters(filterDefaultValues);
  }, [setFilters]);

  return (
    <VStack flex={1} spacing={4}>
      <Select
        inputGroupProps={inputGroupProps}
        inputLeftAddonProps={inputLeftAddonProps}
        inputLeftAddonWrapperProps={inputLeftAddonWrapperProps}
        leftComponent='Rarities'
        options={cardRarityOptions}
        value={cardRarityOptions.filter(item =>
          filters.rarities.find((v: any) => v === item.value)
        )}
        onChange={(val: any) => handleChange(val, 'rarities')}
        isMulti
      />
      <Select
        inputGroupProps={inputGroupProps}
        inputLeftAddonProps={inputLeftAddonProps}
        inputLeftAddonWrapperProps={inputLeftAddonWrapperProps}
        leftComponent='Categories'
        options={cardCategoryOptions}
        value={cardCategoryOptions.filter(item =>
          filters.categories.find((v: any) => v === item.value)
        )}
        onChange={(val: any) => handleChange(val, 'categories')}
        isMulti
      />
      <Select
        inputGroupProps={inputGroupProps}
        inputLeftAddonProps={inputLeftAddonProps}
        inputLeftAddonWrapperProps={inputLeftAddonWrapperProps}
        leftComponent='Types'
        options={cardTypeOptions}
        value={cardTypeOptions.filter(item => filters.types.find((v: any) => v === item.value))}
        onChange={(val: any) => handleChange(val, 'types')}
        isMulti
      />
      <ButtonGroup w='100%' justifyContent='space-between'>
        <Button variant='ghost' fontSize='sm' onClick={handleClear} disabled={loading}>
          Clear
        </Button>
        <Button
          variant='ghost'
          fontSize='sm'
          onClick={() => onChange && onChange(filters)}
          leftIcon={<Icon as={MagicWand} w={6} />}
          disabled={loading}
        >
          Cast Filters
        </Button>
      </ButtonGroup>
    </VStack>
  );
};

ShopItemFilters.defaultProps = {
  value: filterDefaultValues,
  loading: false,
  onChange: undefined
};
