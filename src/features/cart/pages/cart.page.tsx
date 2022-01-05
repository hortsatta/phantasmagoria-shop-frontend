import { FC, useCallback, useMemo, useState } from 'react';
import { Flex, Center, Heading } from '@chakra-ui/react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { ShoppingBagOpen, Wallet } from 'phosphor-react';

import { useDebounce } from 'features/core/hooks';
import { PageBox } from 'features/core/components';
import { useGetUserAccount } from 'features/user/hooks';
import { OrderForm } from 'features/order/components';
import { CartForm, CartFormData } from '../components';
import { useGetCart, useUpsertCart } from '../hooks';

export const CartPage: FC = () => {
  const { userAccount, loading: userAccountLoading } = useGetUserAccount();
  const { cart, loading: cartLoading } = useGetCart();
  const { updateCartItems, clearCartItems, loading: upsertCartLoading } = useUpsertCart();
  const { debounce, loading: debounceLoading } = useDebounce();
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);
  const { nextStep, prevStep, activeStep } = useSteps({ initialStep: 0 });

  const loading = useMemo(
    () => userAccountLoading || cartLoading || upsertCartLoading,
    [userAccountLoading, cartLoading, upsertCartLoading]
  );
  const headerText = useMemo(() => (activeStep !== 0 ? 'Place Order' : 'My Cart'), [activeStep]);

  const checkout = useCallback((cartFormData: CartFormData) => {
    debounce(() => {
      nextStep();
    });
    console.log(cartFormData);
  }, []);

  return (
    <PageBox d='flex' alignItems='flex-start' justifyContent='center' pb={0} h='100%' flex={1}>
      <Flex
        pt={8}
        flexDir='column'
        pb='60px'
        w='4xl'
        minH='100vh'
        pos='relative'
        justifyContent='flex-start'
      >
        <Center mb={6}>
          <Heading as='h2' fontSize='4xl'>
            {headerText}
          </Heading>
        </Center>
        {cart && (
          <Steps flex={0} activeStep={activeStep}>
            <Step label='Confirm Order' icon={ShoppingBagOpen}>
              <CartForm
                w='100%'
                cart={cart}
                isSubmitting={debounceLoading}
                onCartChange={updateCartItems}
                onClearCartItems={clearCartItems}
                onSubmit={checkout}
                loading={loading}
              />
            </Step>
            <Step label='Checkout' icon={Wallet}>
              <OrderForm
                w='100%'
                userAccount={userAccount}
                cartItems={cart.cartItems}
                isComplete={isCheckoutComplete}
                isSubmitting={debounceLoading}
                onSubmit={() => null}
                loading={loading}
              />
            </Step>
          </Steps>
        )}
      </Flex>
    </PageBox>
  );
};
