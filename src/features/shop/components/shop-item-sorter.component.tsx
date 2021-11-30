import { FC, useState } from 'react';
import { Button, Text, useRadioGroup, VStack } from '@chakra-ui/react';
import { MagicWand } from 'phosphor-react';

import { Icon, Radio } from 'features/core/components';

type Props = {
  value?: any;
  loading?: boolean;
  onChange?: (val: any) => void;
};

const fieldOptions = [
  { label: 'Newest', value: 'published_at' },
  { label: 'Alphabetical', value: 'name' }
];

const orderOptions = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' }
];

const sortDefaultValue = 'published_at:desc';

export const ShopItemSorter: FC<Props> = ({ value, loading, onChange }) => {
  const [currentField, currentOrder] = (value || sortDefaultValue).split(':');
  const [field, setField] = useState(currentField);
  const [order, setOrder] = useState(currentOrder);

  const { getRootProps: getFieldRootProps, getRadioProps: getFieldRadioProps } = useRadioGroup({
    name: 'Field',
    defaultValue: currentField,
    onChange: (val: string) => setField(val)
  });

  const { getRootProps: getOrderRootProps, getRadioProps: getOrderRadioProps } = useRadioGroup({
    name: 'Order',
    defaultValue: currentOrder,
    onChange: (val: string) => setOrder(val)
  });

  const fieldGroup = getFieldRootProps();
  const orderGroup = getOrderRootProps();

  return (
    <VStack alignItems='flex-start' spacing={4}>
      <VStack {...fieldGroup} alignItems='flex-start' w='100%'>
        <Text color='rgba(255,255,255,0.7)' fontSize={13} textTransform='uppercase'>
          By
        </Text>
        {fieldOptions.map(({ label, value: option }) => {
          const radio = getFieldRadioProps({ value: option });
          return (
            <Radio key={option} {...radio}>
              {label}
            </Radio>
          );
        })}
      </VStack>
      <VStack {...orderGroup} alignItems='flex-start' w='100%'>
        <Text color='rgba(255,255,255,0.7)' fontSize={13} textTransform='uppercase'>
          Order
        </Text>
        {orderOptions.map(({ label, value: option }) => {
          const radio = getOrderRadioProps({ value: option });
          return (
            <Radio key={option} {...radio}>
              {label}
            </Radio>
          );
        })}
      </VStack>
      <Button
        alignSelf='flex-end'
        fontSize='sm'
        variant='ghost'
        onClick={() => onChange && onChange(`${field}:${order}`)}
        leftIcon={<Icon as={MagicWand} w={6} />}
        disabled={loading}
      >
        Cast Order
      </Button>
    </VStack>
  );
};

ShopItemSorter.defaultProps = {
  value: 'published_at:desc',
  loading: false,
  onChange: undefined
};
