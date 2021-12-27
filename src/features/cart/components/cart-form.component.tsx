import { FC, FormEvent, useCallback, useMemo } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, ButtonGroup, Flex, FlexProps, Text, VStack } from '@chakra-ui/react';
import { Eraser, RocketLaunch } from 'phosphor-react';

import { formatPrice } from 'helpers';
import { Cart, CartItem as CartItemModel } from 'models';
import { Icon, LoadingOverlay, Surface } from 'features/core/components';
import { CartItem } from './cart-item.component';

import variables from 'assets/styles/_variables.module.scss';

type CartItemFormData = CartItemModel & {
  currentQuantity: number;
};

type CartFormData = Omit<Cart, 'cartItems'> & {
  cartItems: CartItemFormData[];
  totalPrice: number;
};

type Props = Omit<FlexProps, 'onSubmit'> & {
  onSubmit: (cart: CartFormData) => void;
  cart: Cart | null;
  loading?: boolean;
  isComplete?: boolean;
};

const schema = z.object({
  id: z.string(),
  cartItems: z.array(z.any()).min(1, 'Item(s) is Required')
});

const defaultValues: CartFormData = {
  id: '0',
  cartItems: [],
  totalPrice: 0
};

const CartForm: FC<Props> = ({ onSubmit, cart, loading, isComplete, ...moreProps }) => {
  const currentCart = useMemo(() => {
    if (!cart) {
      return defaultValues;
    }

    const { cartItems, ...moreCart } = cart;
    const totalPrice = cartItems.reduce(
      (t, value) => t + value.cardProduct.price * value.quantity,
      0
    );
    return {
      ...moreCart,
      cartItems: cartItems.map((item: any) => ({ ...item, currentQuantity: item.quantity })),
      totalPrice
    };
  }, [cart]);

  const isEmpty = useMemo(() => !currentCart.cartItems.length && !loading, [currentCart, loading]);

  const {
    control,
    handleSubmit: submitForm,
    getValues,
    setValue,
    watch
  } = useForm<CartFormData>({
    shouldFocusError: false,
    defaultValues: currentCart,
    resolver: zodResolver(schema)
  });

  const { fields } = useFieldArray({ control, name: 'cartItems' });
  const totalPrice = watch('totalPrice');

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      submitForm(async (cartFormData: CartFormData) => {
        console.log('cartFormData', cartFormData);
        await onSubmit(cartFormData);
      })();
    },
    [submitForm, onSubmit]
  );

  const handleQuantityChange = useCallback(
    (cartItem: CartItemFormData, onChange: any) => {
      onChange(cartItem);
      const tp = getValues('cartItems').reduce(
        (t, value) => t + value.cardProduct.price * value.currentQuantity,
        0
      );
      setValue('totalPrice', tp);
    },
    [getValues]
  );

  return (
    <Flex as='form' pos='relative' flexDir='column' onSubmit={handleSubmit} {...moreProps}>
      <Surface p={12}>
        <LoadingOverlay loading={loading}>
          <VStack flex={1} alignItems='flex-start' spacing={4}>
            {fields.map((field, index) => (
              <Controller
                key={field.id}
                name={`cartItems.${index}`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CartItem
                    key={field.id}
                    cartItem={value}
                    onChange={(item: CartItemFormData) => handleQuantityChange(item, onChange)}
                  />
                )}
              />
            ))}
            <Box
              flexGrow={0}
              py={2}
              minW='130px'
              textAlign='center'
              borderRadius='999px'
              overflow='hidden'
              bgColor={variables.accentColor}
            >
              <Text fontSize='md'>{formatPrice(totalPrice)}</Text>
            </Box>
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
      </Surface>
      <ButtonGroup
        justifyContent='space-between'
        alignItems='center'
        flex={1}
        mt={6}
        disabled={loading || isComplete}
      >
        <Button variant='ghost' leftIcon={<Icon as={Eraser} />}>
          Clear All
        </Button>
        <Button
          pl={6}
          pr={7}
          w='190px'
          onClick={handleSubmit}
          leftIcon={<Icon w={6} as={RocketLaunch} />}
          isLoading={loading}
        >
          Checkout
        </Button>
      </ButtonGroup>
    </Flex>
  );
};

CartForm.defaultProps = {
  loading: false,
  isComplete: false
};

export type { CartItemFormData, CartFormData };
export { CartForm };
