import { FC, useCallback, useContext, useEffect, useMemo } from 'react';
import { useReactiveVar } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { Flex, Center, Heading } from '@chakra-ui/react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { ShoppingBagOpen, Wallet } from 'phosphor-react';

import { appModulesVar, stripeElementsOptions, stripePromise } from 'config';
import { PageContext } from 'features/core/contexts';
import { useDebounce } from 'features/core/hooks';
import { useGetUser } from 'features/user/hooks';
import { useStripeOrder } from 'features/order/hooks';
import { PageBox } from 'features/core/components';
import { OrderForm, OrderFormData } from 'features/order/components';
import { CartForm } from '../components';
import { useGetCart, useUpsertCart } from '../hooks';

export const CartPage: FC = () => {
  const history = useHistory();
  const { changePage } = useContext(PageContext);
  const { debounce, loading: debounceLoading } = useDebounce();
  const appModules = useReactiveVar(appModulesVar);
  const { userAccount, loading: userAccountLoading } = useGetUser();
  const { cart, loading: cartLoading } = useGetCart();
  const {
    updateCartItems,
    clearCartItems,
    clearCart,
    loading: upsertCartLoading
  } = useUpsertCart();
  const {
    addOrder,
    upsertPaymentIntent,
    clientSecret,
    paymentIntentId,
    loading: upsertPaymentIntentLoading
  } = useStripeOrder();
  const { nextStep, activeStep } = useSteps({ initialStep: 0 });

  const loading = useMemo(
    () => userAccountLoading || cartLoading || upsertCartLoading,
    [userAccountLoading, cartLoading, upsertCartLoading]
  );
  const headerText = useMemo(() => (activeStep !== 0 ? 'Place Order' : 'My Cart'), [activeStep]);

  useEffect(() => {
    if (!clientSecret || !clientSecret.trim()) {
      return;
    }
    nextStep();
  }, [clientSecret]);

  const handleAddOrder = useCallback(
    async (orderFormData: OrderFormData, orderCompletePath?: string) => {
      await addOrder(orderFormData);
      await clearCart();
      paymentIntentId && history.push(`${orderCompletePath}/?pi=${paymentIntentId}`);
    },
    [paymentIntentId, addOrder, clearCart]
  );

  const handleSubmit = useCallback(async () => {
    if (userAccount) {
      await upsertPaymentIntent();
    } else {
      debounce(() => {
        const registrationPath = `${appModules?.user.path}${appModules?.user.children?.signUp.path}`;
        changePage(appModules?.user.children?.signUp.key, registrationPath, false, {
          isCheckout: true
        });
      });
    }
  }, [userAccount, appModules]);

  return (
    <PageBox
      d='flex'
      alignItems='flex-start'
      justifyContent='center'
      pb={0}
      h='100%'
      flex={1}
      pageTitle='Cart'
      pageDescription='My cart'
    >
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
                isSubmitting={upsertPaymentIntentLoading || debounceLoading}
                onCartChange={updateCartItems}
                onClearCartItems={() => clearCartItems(cart)}
                onSubmit={handleSubmit}
                loading={loading}
              />
            </Step>
            <Step label='Checkout' icon={Wallet}>
              {clientSecret && (
                <Elements stripe={stripePromise} options={stripeElementsOptions(clientSecret)}>
                  <OrderForm
                    w='100%'
                    userAccount={userAccount}
                    cartItems={cart.cartItems}
                    loading={loading}
                    onAddOrder={handleAddOrder}
                  />
                </Elements>
              )}
            </Step>
          </Steps>
        )}
      </Flex>
    </PageBox>
  );
};
