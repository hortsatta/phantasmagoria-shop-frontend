import { FC, useContext, useEffect, useMemo } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Box, Center, Heading } from '@chakra-ui/react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { Flask, TestTube } from 'phosphor-react';

import { appModulesVar } from 'config';
import { signIn } from 'services';
import { PageContext } from 'features/core/contexts';
import { PageBox } from 'features/core/components';
import { useSignUp } from '../hooks';
import { SignUpForm, SignUpOptionalForm } from '../components';

export const RegistrationPage: FC = () => {
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
      return;
    }

    const delay = setTimeout(() => {
      setStep(steps.length - 1);
    }, 300);

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(delay);
  }, [isSignUpComplete]);

  useEffect(() => {
    if (!isOptionalDetailComplete) {
      return;
    }

    const delay = setTimeout(() => {
      // Navigate to main shop page
      const shopListNav = appModules.shop.children?.list;
      changePage(shopListNav?.key, shopListNav?.path);
    }, 800);

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(delay);
      // Sign in user
      if (currentUser.current) {
        const { jwt, userAccount } = currentUser.current;
        signIn(jwt, userAccount);
      }
    };
  }, [isOptionalDetailComplete, loading]);

  return (
    <PageBox pt={8}>
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
