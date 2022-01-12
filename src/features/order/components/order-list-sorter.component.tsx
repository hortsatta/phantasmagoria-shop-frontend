import { FC, useState } from 'react';
import { Button, Text, TextProps, useRadioGroup, VStack } from '@chakra-ui/react';
import { MagicWand } from 'phosphor-react';

import { Icon, Radio } from 'features/core/components';

const sectionHeaderStyles: TextProps = {
  color: 'rgba(255,255,255,0.7)',
  fontSize: 13,
  textTransform: 'uppercase'
};

type Props = {
  value?: any;
  loading?: boolean;
  onChange?: (val: any) => void;
};

const sectionProps = {
  p: 4,
  alignItems: 'flex-start',
  w: '100%',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 4,
  overflow: 'hidden'
};

const fieldOptions = [
  { label: 'Purchase Date', value: 'date' },
  { label: 'Total Amount', value: 'totalPrice' }
];

const ordrOptions = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' }
];

const sortDefaultValue = 'date:desc';

export const OrderListSorter: FC<Props> = ({ value, loading, onChange }) => {
  // Shorten "order" variable to "ordr" to prevent confusion.
  const [currentField, currentOrdr] = (value || sortDefaultValue).split(':');
  const [field, setField] = useState(currentField);
  const [ordr, setOrdr] = useState(currentOrdr);

  const { getRootProps: getFieldRootProps, getRadioProps: getFieldRadioProps } = useRadioGroup({
    name: 'Field',
    defaultValue: currentField,
    onChange: (val: string) => setField(val)
  });

  const { getRootProps: getOrdrRootProps, getRadioProps: getOrdrRadioProps } = useRadioGroup({
    name: 'Order',
    defaultValue: currentOrdr,
    onChange: (val: string) => setOrdr(val)
  });

  const fieldGroup = getFieldRootProps();
  const ordrGroup = getOrdrRootProps();

  return (
    <VStack alignItems='flex-start' spacing={4}>
      <VStack {...fieldGroup} {...sectionProps}>
        <Text {...sectionHeaderStyles}>By</Text>
        {fieldOptions.map(({ label, value: option }) => {
          const radio = getFieldRadioProps({ value: option });
          return (
            <Radio key={option} {...radio}>
              {label}
            </Radio>
          );
        })}
      </VStack>
      <VStack {...ordrGroup} {...sectionProps}>
        <Text {...sectionHeaderStyles}>Order</Text>
        {ordrOptions.map(({ label, value: option }) => {
          const radio = getOrdrRadioProps({ value: option });
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
        onClick={() => onChange && onChange(`${field}:${ordr}`)}
        leftIcon={<Icon as={MagicWand} w={6} />}
        disabled={loading}
      >
        Cast Order
      </Button>
    </VStack>
  );
};

OrderListSorter.defaultProps = {
  value: 'date:desc',
  loading: false,
  onChange: undefined
};
