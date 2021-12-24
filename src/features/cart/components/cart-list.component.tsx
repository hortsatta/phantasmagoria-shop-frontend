import { FC, useMemo } from 'react';
import { Flex, Text, VStack } from '@chakra-ui/react';

import { CartItem as CartItemModel } from 'models';
import { LoadingOverlay } from 'features/core/components';
import { CartItem } from './cart-item.component';

import variables from 'assets/styles/_variables.module.scss';

type Props = {
  cartItems: CartItemModel[];
  loading?: boolean;
};

export const CartList: FC<Props> = ({ cartItems, loading }) => {
  const isEmpty = useMemo(() => !cartItems.length && !loading, [cartItems, loading]);

  return (
    <Flex pos='relative' flexDir='column' w='100%'>
      <LoadingOverlay loading={loading}>
        <VStack alignItems='flex-start' spacing={4}>
          {cartItems.map((cartItem: CartItemModel) => (
            <CartItem key={cartItem.id} cartItem={cartItem} />
          ))}
        </VStack>
        {isEmpty && (
          <Text
            mt={8}
            w='100%'
            textAlign='center'
            fontFamily={variables.primaryFont}
            fontSize='4xl'
          >
            we could only show nothing.
          </Text>
        )}
      </LoadingOverlay>
    </Flex>
  );
};

CartList.defaultProps = {
  loading: false
};
