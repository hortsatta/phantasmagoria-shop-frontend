import { FC, FormEvent, useCallback, useEffect, useMemo } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Divider,
  FlexProps,
  Flex,
  Text,
  VStack,
  useDisclosure
} from '@chakra-ui/react';
import { RocketLaunch } from 'phosphor-react';

import { appModulesVar, messages } from 'config';
import { formatPrice } from 'helpers';
import { Address, CartItem, Order, UserAccount } from 'models';
import { useDebounce, useNotification } from 'features/core/hooks';
import { useEditUser } from 'features/user/hooks';
import {
  FormSectionHeading,
  Icon,
  LoadingOverlay,
  SubHeading,
  Surface
} from 'features/core/components';
import { ShippingAddress } from 'features/user/components';
import { MiniCartItem, CartItemFormData } from 'features/cart/components';
import { PaymentModal } from './payment-modal.component';

import variables from 'assets/styles/_variables.module.scss';

type OrderFormData = Omit<Order, 'id' | 'userAccount' | 'date' | 'orderItems' | 'paymentIntent'> & {
  cartItems: CartItem[];
};

type Props = Omit<FlexProps, 'onSubmit'> & {
  userAccount: UserAccount | null;
  cartItems: CartItemFormData[];
  onAddOrder: (orderFormData: OrderFormData, orderCompletePath?: string) => void;
  loading?: boolean;
};

const schema = z.object({
  totalPrice: z.number().nonnegative(),
  address: z.object({
    id: z.string(),
    fullName: z.string(),
    phoneNumber: z.string().min(6),
    region: z.string(),
    province: z.string(),
    city: z.string(),
    barangay: z.string(),
    zipCode: z.number().min(3),
    addressLine: z.string(),
    isDefault: z.boolean()
  }),
  cartItems: z.array(z.any()).min(1, 'Must select at least 1 item')
});

const defaultValues = {
  totalPrice: 0,
  address: {},
  cartItems: []
};

const OrderForm: FC<Props> = ({ userAccount, cartItems, loading, onAddOrder, ...moreProps }) => {
  const appModules: any = useReactiveVar(appModulesVar);
  const stripe = useStripe();
  const elements = useElements();
  const { debounce, loading: debounceLoading } = useDebounce();
  const { notify } = useNotification();
  const { updateAddress, loading: editUserLoading } = useEditUser();
  // Stripe payment modal
  const {
    isOpen: paymentModalIsOpen,
    onOpen: paymentModalOnOpen,
    onClose: paymentModalOnClose
  } = useDisclosure();

  const { addresses: userCurrentAddresses = [] } = userAccount || {};

  const userCurrentAddress: any = useMemo(() => {
    if (!userCurrentAddresses.length) {
      return undefined;
    }

    return userCurrentAddresses.find((address: Address) => address.isDefault);
  }, [userCurrentAddresses]);

  const currentOrder = useMemo(() => {
    if (!cartItems.length) {
      return defaultValues;
    }

    const totalPrice = cartItems.reduce(
      (t, value) => t + value.cardProduct.price * value.quantity,
      0
    );

    return {
      totalPrice,
      address: userCurrentAddress,
      cartItems
    };
  }, [cartItems, userCurrentAddress]);

  const {
    control,
    handleSubmit: submitForm,
    setValue,
    watch
  } = useForm<OrderFormData>({
    shouldFocusError: false,
    defaultValues: currentOrder,
    resolver: zodResolver(schema)
  });

  const totalPrice = watch('totalPrice');

  useEffect(() => {
    setValue('address', userCurrentAddress);
  }, [userCurrentAddress]);

  const confirmPayment = useCallback(async () => {
    submitForm(async (orderFormData: OrderFormData) => {
      debounce();
      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }

      try {
        const orderCompletePath = `${appModules.order.path}${appModules.order.children?.complete.path}`;
        const { error } = await stripe.confirmPayment({
          // `Elements` instance that was used to create the Payment Element
          elements,
          confirmParams: { return_url: `${process.env.REACT_APP_BASE_URI}${orderCompletePath}` },
          redirect: 'if_required'
        });

        if (error) {
          // This point will only be reached if there is an immediate error when
          // confirming the payment. Show error to your customer (e.g., payment
          // details incomplete)
          notify('error', 'Failed', error.message);
        } else {
          onAddOrder(orderFormData, orderCompletePath);
        }
      } catch (err) {
        notify('error', 'Failed', messages.problem);
      }
    })();
  }, [stripe, elements]);

  const handleOpenPaymentModal = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (!userCurrentAddress) {
        notify('error', 'Failed', 'Please provide an address');
        return;
      }

      paymentModalOnOpen();
    },
    [userCurrentAddress]
  );

  if (!userAccount) {
    return null;
  }

  return (
    <>
      <Flex as='form' pos='relative' flexDir='column' {...moreProps}>
        <Surface pos='relative' p={12}>
          <LoadingOverlay h='100%' bgColor='rgba(0,0,0,0.5)' loading={loading || !cartItems.length}>
            <VStack flex={1} alignItems='flex-start' spacing={4}>
              <Controller
                name='address'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ShippingAddress
                    w='100%'
                    value={value as any}
                    userCurrentAddresses={userCurrentAddresses}
                    headerText='Ship To'
                    loading={loading}
                    isSubmitting={editUserLoading}
                    onUpdateAddress={updateAddress}
                    onChange={onChange}
                    isRemoveDisabled
                  />
                )}
              />
              <Box w='100%'>
                <FormSectionHeading>Items</FormSectionHeading>
                <VStack flex={1} alignItems='flex-start' spacing={3}>
                  {cartItems.map(ci => (
                    <MiniCartItem key={ci.id} cartItem={ci} />
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
                      <Text fontSize='xl'>{formatPrice(totalPrice)}</Text>
                    </Box>
                  </Flex>
                </VStack>
              </Box>
            </VStack>
          </LoadingOverlay>
        </Surface>
        <Flex justifyContent='flex-end' alignItems='center' flex={1} mt={6}>
          <Button
            pl={6}
            pr={7}
            w='220px'
            onClick={handleOpenPaymentModal}
            leftIcon={<Icon w={6} as={RocketLaunch} />}
            isLoading={loading}
            disabled={loading || editUserLoading}
          >
            Place Order
          </Button>
        </Flex>
      </Flex>
      <PaymentModal
        onClose={paymentModalOnClose}
        isOpen={paymentModalIsOpen}
        isSubmitting={debounceLoading}
        loading={loading}
        onSubmit={confirmPayment}
      />
    </>
  );
};

OrderForm.defaultProps = {
  loading: false
};

export type { OrderFormData };
export { OrderForm };
