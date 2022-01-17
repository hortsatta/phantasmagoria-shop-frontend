import { FC, useMemo } from 'react';
import { Box, BoxProps, Divider, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { CheckCircle } from 'phosphor-react';

import { formatPrice } from 'helpers';
import { FormSectionHeading, Icon, LoadingOverlay, SubHeading } from 'features/core/components';
import { AddressFields } from 'features/user/components';
import { MiniCartItem } from 'features/cart/components';
import { useGetOrdersDetailByIds } from '../hooks';

import variables from 'assets/styles/_variables.module.scss';

type Props = BoxProps & {
  id: string;
};

export const OrderItemDetail: FC<Props> = ({ id, ...moreProps }) => {
  const { orders, loading } = useGetOrdersDetailByIds([id]);

  const currentOrderItem = useMemo(() => (!orders.length ? null : orders[0]), [orders]);

  const cartItems = useMemo(() => {
    if (!currentOrderItem) {
      return [];
    }

    const { orderItems } = currentOrderItem || {};

    return orderItems.map(item => ({
      ...item,
      currentquantity: 0,
      cardProduct: { ...item.cardProduct, price: item.price }
    }));
  }, [currentOrderItem]);

  const { totalPrice, date, address } = currentOrderItem || {};

  const formattedDate = useMemo(
    () => (date ? dayjs(date).format('YYYY-MMM-DD').toUpperCase() : ''),
    [date]
  );

  return (
    <Box {...moreProps}>
      <LoadingOverlay loading={loading}>
        {!loading && (
          <>
            <HStack alignItems='flex-start' mb={4} spacing={8}>
              <Box flex={1} maxW='md'>
                <FormSectionHeading pt={0}>Shipped To</FormSectionHeading>
                {address && (
                  <AddressFields
                    flexShrink={0}
                    p={4}
                    w='md'
                    bgColor={variables.inputBgColor}
                    borderRadius='4px'
                    overflow='hidden'
                    address={address as any}
                  />
                )}
              </Box>
              <Box>
                <HStack spacing={4}>
                  <Icon w={10} h={10} as={CheckCircle} color={variables.successColor} />
                  <Text w='150px' flexGrow={0} fontSize='xl'>
                    {formattedDate}
                  </Text>
                </HStack>
              </Box>
            </HStack>
            <Box>
              <FormSectionHeading>Items</FormSectionHeading>
              <VStack flex={1} alignItems='flex-start' spacing={3}>
                {cartItems.map((ci, index) => (
                  <MiniCartItem key={index} cartItem={ci} />
                ))}
                <Divider />
                <Flex w='100%' justifyContent='flex-end' alignItems='center'>
                  <SubHeading mr={4} fontSize='3xl'>
                    Total
                  </SubHeading>
                  <Box
                    flexGrow={0}
                    py={2}
                    minW='115px'
                    bgColor={variables.accentColor}
                    textAlign='center'
                    borderRadius='3px'
                    overflow='hidden'
                  >
                    <Text fontSize='xl'>{formatPrice(totalPrice || 0)}</Text>
                  </Box>
                </Flex>
              </VStack>
            </Box>
          </>
        )}
      </LoadingOverlay>
    </Box>
  );
};
