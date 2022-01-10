import { CSSProperties, FC, useContext, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import {
  Box,
  Button,
  ButtonProps,
  Center,
  Flex,
  Heading,
  HStack,
  StackDivider
} from '@chakra-ui/react';
import Lottie from 'lottie-react';

import { appModulesVar } from 'config';
import { PageContext } from 'features/core/contexts';
import { useUrlQuery } from 'features/core/hooks';
import { LoadingOverlay, PageBox, SubHeading, Surface } from 'features/core/components';
import { useOrder } from '../hooks';

import lottieDone from 'assets/images/lottie-done.json';

const LOTTIE_STYLES: CSSProperties = {
  width: '270px',
  height: '270px'
};

const buttonStyles: ButtonProps = {
  variant: 'ghost',
  size: 'sm'
};

export const OrderCompletePage: FC = () => {
  const history = useHistory();
  const query = useUrlQuery();
  const { changePage } = useContext(PageContext);
  const appModules = useReactiveVar(appModulesVar);
  const { loading, currentPaymentIntent, getPaymentIntent } = useOrder();
  const [pageLoading, setPageLoading] = useState(true);

  const isStatusSuccessful = useMemo(() => {
    const { status } = currentPaymentIntent || {};
    const isLoading = loading || pageLoading;
    return status === 'succeeded' && !isLoading;
  }, [currentPaymentIntent, loading, pageLoading]);

  const headerText = useMemo(
    () => (isStatusSuccessful ? 'Order Complete' : 'Order'),
    [isStatusSuccessful]
  );

  const returnToShopPage = () => {
    const shopListNav = appModules?.shop.children?.list;
    changePage(shopListNav?.key, shopListNav?.path);
  };

  useEffect(() => {
    const piid = query.get('pi');
    if (!piid) {
      return;
    }

    (async () => {
      const isComplete = await getPaymentIntent(piid);
      setPageLoading(!isComplete);
    })();
  }, []);

  return (
    <PageBox d='flex' alignItems='flex-start' justifyContent='center' pb={0} h='100%' flex={1}>
      <Flex
        pt={8}
        flexDir='column'
        pb='60px'
        w='2xl'
        minH='100vh'
        pos='relative'
        justifyContent='flex-start'
      >
        <Center mb={6}>
          <Heading as='h2' fontSize='4xl'>
            {headerText}
          </Heading>
        </Center>
        <Surface pos='relative' pb={12} minH='270px'>
          <LoadingOverlay h='100%' loading={pageLoading || loading}>
            {isStatusSuccessful && (
              <Box flex={1}>
                <Flex alignItems='center' flex={1} pr={12}>
                  <Lottie style={LOTTIE_STYLES} animationData={lottieDone} loop={false} />
                  <SubHeading w='70%' textAlign='center' lineHeight={1.2}>
                    Congratulations! Your order has been successful. View the order details or
                    return to shop.
                  </SubHeading>
                </Flex>
                <HStack
                  justifyContent='center'
                  alignItems='center'
                  w='100%'
                  h='32px'
                  px={12}
                  divider={
                    <StackDivider
                      h='100%'
                      alignSelf='center'
                      opacity={0.5}
                      orientation='vertical'
                    />
                  }
                >
                  <Button {...buttonStyles} onClick={returnToShopPage}>
                    Return to Shop
                  </Button>
                  <Button {...buttonStyles} onClick={() => history.push('addShopItemPath')}>
                    View Order Details
                  </Button>
                </HStack>
              </Box>
            )}
          </LoadingOverlay>
        </Surface>
      </Flex>
    </PageBox>
  );
};
