import { FC } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { MinusCircle, PlusCircle } from 'phosphor-react';

import { Icon, IconButton } from 'features/core/components';

type Props = {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export const Quantity: FC<Props> = ({ value, onIncrement, onDecrement }) => (
  <Flex alignItems='center'>
    <IconButton
      aria-label='decrement quantity'
      icon={<Icon as={MinusCircle} w={7} />}
      onClick={onDecrement}
    />
    <Box mx={2} w='50px' textAlign='center'>
      <Text fontSize='xl' lineHeight={1}>
        {value}
      </Text>
    </Box>
    <IconButton
      aria-label='increment quantity'
      icon={<Icon as={PlusCircle} w={7} />}
      onClick={onIncrement}
    />
  </Flex>
);
