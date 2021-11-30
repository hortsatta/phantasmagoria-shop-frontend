import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Button, ButtonGroup, VStack } from '@chakra-ui/react';
import { Eraser } from 'phosphor-react';

import { cardCategoriesVar, cardRaritiesVar, cardTypesVar } from 'config';
import { CardCategory, CardRarity, CardType } from 'models';
import { Icon, Select } from 'features/core/components';

type Props = {
  value?: any;
  loading?: boolean;
  onChange?: (val: any) => void;
};

const LABEL_WIDTH = '117px';

const filterDefaultValues = { rarities: [], categories: [], types: [] };

export const CardFilters: FC<Props> = ({ value, loading, onChange }) => {
  const cardRarities = useReactiveVar(cardRaritiesVar);
  const cardCategories = useReactiveVar(cardCategoriesVar);
  const cardTypes = useReactiveVar(cardTypesVar);
  const [filters, setFilters] = useState<any>(filterDefaultValues);

  useEffect(() => {
    const { rarities, categories, types } = value;
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
        inputLeftAddonProps={{ w: LABEL_WIDTH }}
        leftComponent='Rarities'
        options={cardRarityOptions}
        value={cardRarityOptions.filter(item =>
          filters.rarities.find((v: any) => v === item.value)
        )}
        onChange={(val: any) => handleChange(val, 'rarities')}
        isMulti
      />
      <Select
        inputLeftAddonProps={{ w: LABEL_WIDTH }}
        leftComponent='Categories'
        options={cardCategoryOptions}
        value={cardCategoryOptions.filter(item =>
          filters.categories.find((v: any) => v === item.value)
        )}
        onChange={(val: any) => handleChange(val, 'categories')}
        isMulti
      />
      <Select
        inputLeftAddonProps={{ w: LABEL_WIDTH }}
        leftComponent='Types'
        options={cardTypeOptions}
        value={cardTypeOptions.filter(item => filters.types.find((v: any) => v === item.value))}
        onChange={(val: any) => handleChange(val, 'types')}
        isMulti
      />
      <ButtonGroup w='100%' justifyContent='space-between'>
        <Button
          variant='ghost'
          onClick={handleClear}
          leftIcon={<Icon as={Eraser} />}
          disabled={loading}
        >
          Clear
        </Button>
        <Button
          pl={6}
          pr={7}
          onClick={() => onChange && onChange(filters)}
          isLoading={loading}
          disabled={loading}
        >
          Apply Filters
        </Button>
      </ButtonGroup>
    </VStack>
  );
};

CardFilters.defaultProps = {
  value: {},
  loading: false,
  onChange: undefined
};
