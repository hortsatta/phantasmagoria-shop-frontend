import { FC, useContext, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { Box, Center, Heading } from '@chakra-ui/react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { Flask, TestTube } from 'phosphor-react';

import { appModulesVar } from 'config';
import { signIn } from 'services';
import { PageContext } from 'features/core/contexts';
import { useUpsertCart } from 'features/cart/hooks';
import { PageBox } from 'features/core/components';
import { useSignUp } from '../hooks';
import { SignUpForm, SignUpOptionalForm } from '../components';

export const RegistrationPage: FC = () => {
  const { state: { isCheckout } = {} } = useLocation<any>();
  const { changePage } = useContext(PageContext);
  const appModules: any = useReactiveVar(appModulesVar);
  const { activeStep, setStep } = useSteps({ initialStep: 0 });
  const {
    loading,
    isSignUpComplete,
    isOptionalDetailComplete,
    currentUser,
    setIsOptionalDetailComplete,
    addOptionalData,
    signUp
  } = useSignUp();
  const { createCartFromGuestCart } = useUpsertCart();

  const steps = useMemo(
    () => [
      {
        label: 'User Account',
        icon: Flask,
        component: <SignUpForm loading={loading || isSignUpComplete} onSubmit={signUp} />
      },
      {
        label: 'Additional Info',
        icon: TestTube,
        component: (
          <SignUpOptionalForm
            loading={loading || isOptionalDetailComplete}
            onSkip={() => setIsOptionalDetailComplete(true)}
            onSubmit={addOptionalData}
          />
        )
      }
    ],
    [addOptionalData, signUp, loading]
  );

  useEffect(() => {
    if (!isSignUpComplete) {
      return undefined;
    }

    const delay = setTimeout(() => {
      setStep(steps.length - 1);
    }, 300);

    return () => {
      clearTimeout(delay);
    };
  }, [isSignUpComplete]);

  useEffect(() => {
    if (!isOptionalDetailComplete) {
      return undefined;
    }
    // Navigate to main shop page or to the cart page
    const delay = setTimeout(() => {
      const nav = isCheckout ? appModules.cart : appModules.shop.children?.list;
      changePage(nav?.key, nav?.path);
    }, 800);

    return () => {
      clearTimeout(delay);
      // Sign in user
      if (currentUser.current) {
        const { jwt, userAccount } = currentUser.current;
        signIn(jwt, userAccount, () => {
          // Create cart from guest cart if checkout.
          isCheckout && createCartFromGuestCart();
        });
      }
    };
  }, [isOptionalDetailComplete, loading]);

  return (
    <PageBox pt={8} pageTitle='Sign Up' pageDescription='Register a new account.'>
      <Center mb={6}>
        <Heading as='h2' fontSize='4xl'>
          Conjure An Account
        </Heading>
      </Center>
      <Box m='0 auto' maxW='2xl' w='100%'>
        <Steps activeStep={activeStep}>
          {steps.map(({ component, label, icon }) => (
            <Step key={label} label={label} icon={icon}>
              {component}
            </Step>
          ))}
        </Steps>
      </Box>
    </PageBox>
  );
};
