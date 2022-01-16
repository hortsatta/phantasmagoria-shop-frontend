import { FC, useContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Box, Center, Flex, Heading, VStack, useDisclosure } from '@chakra-ui/react';
import { Funnel } from 'phosphor-react';

import { appModulesVar } from 'config';
import { signOut } from 'services';
import { PageContext } from 'features/core/contexts';
import { useDebounce } from 'features/core/hooks';
import { useGetOrdersByFilters } from 'features/order/hooks';
import { Icon, IconButton, LoadingOverlay, PageBox, Surface } from 'features/core/components';
import { OrderItemDetailModal, OrderList, OrderListSorterModal } from 'features/order/components';
import { EditUserAccountForm } from '../components';
import { useGetUser, useEditUser } from '../hooks';
import { Order } from 'models';

export const UserAccountPage: FC = () => {
  const { changePage } = useContext(PageContext);
  const { debounce, loading: debounceLoading } = useDebounce();
  const { userAccount, loading: getUserLoading } = useGetUser();
  const { updateUserAccount, updateAddress, loading: editUserLoading } = useEditUser();
  const { orders, orderSort, setOrderSort, loading: getOrdersLoading } = useGetOrdersByFilters();
  const appModules: any = useReactiveVar(appModulesVar);
  const [currentOrderItem, setCurrentOrderItem] = useState<Order | null>(null);

  // View order filter modal
  const {
    isOpen: sortModalIsOpen,
    onOpen: sortModalOnOpen,
    onClose: sortModalOnClose
  } = useDisclosure();
  // View order item detail
  const {
    isOpen: orderDetailModalIsOpen,
    onOpen: orderDetailModalOnOpen,
    onClose: orderDetailModalOnClose
  } = useDisclosure();

  const loading = useMemo(
    () => getUserLoading || editUserLoading,
    [getUserLoading, editUserLoading]
  );

  useEffect(() => {
    if (userAccount || loading) {
      return;
    }

    const userNav = appModules.user;
    const signInNav = appModules.user.children?.signIn;
    changePage(signInNav?.key, `${userNav.path}${signInNav?.path}`, true);
  }, [userAccount, loading]);

  const handleOrderSortChange = useCallback((sort: any) => {
    sortModalOnClose();
    setOrderSort(sort);
  }, []);

  const handleOrderItemClick = useCallback((order: Order) => {
    setCurrentOrderItem(order);
    orderDetailModalOnOpen();
  }, []);

  const handleSignOut = useCallback(() => {
    debounce(() => {
      signOut();
      const shopListNav = appModules.shop.children?.list;
      changePage(shopListNav?.key, shopListNav?.path);
    });
  }, [appModules]);

  return (
    <>
      <PageBox
        d='flex'
        alignItems='flex-start'
        justifyContent='center'
        pb={0}
        h='100%'
        flex={1}
        pageTitle='Account'
        pageDescription='Your account'
      >
        <Flex
          pt={8}
          flexDir='column'
          pb='60px'
          w='100%'
          maxW='4xl'
          minH='100vh'
          pos='relative'
          justifyContent='flex-start'
        >
          <Center mb={6}>
            <Heading as='h2' fontSize='4xl'>
              Account
            </Heading>
          </Center>
          <Box pos='relative'>
            <LoadingOverlay
              h='100%'
              bgColor='rgba(0,0,0,0.3)'
              borderRadius={8}
              loading={debounceLoading}
            >
              <VStack spacing={8}>
                <Surface p={12} w='100%'>
                  {userAccount && (
                    <EditUserAccountForm
                      w='100%'
                      userAccount={userAccount}
                      loading={loading}
                      onUpdateUserAccount={updateUserAccount}
                      onUpdateAddress={updateAddress}
                      onLogout={handleSignOut}
                    />
                  )}
                </Surface>
                <Surface p={12} w='100%'>
                  <Box pos='relative' flex={1}>
                    <IconButton
                      aria-label='view card filters'
                      pos='absolute'
                      top={-2}
                      right={2}
                      icon={<Icon w={6} boxSizing='content-box' as={Funnel} />}
                      onClick={sortModalOnOpen}
                    />
                    <OrderList
                      w='100%'
                      orders={orders}
                      loading={getOrdersLoading}
                      scrollbarsProps={{ style: { height: '430px' } }}
                      onClickItem={handleOrderItemClick}
                    />
                  </Box>
                </Surface>
              </VStack>
            </LoadingOverlay>
          </Box>
        </Flex>
      </PageBox>
      <OrderItemDetailModal
        order={currentOrderItem}
        isOpen={orderDetailModalIsOpen}
        onClose={orderDetailModalOnClose}
      />
      <OrderListSorterModal
        sort={orderSort}
        isOpen={sortModalIsOpen}
        loading={loading}
        onClose={sortModalOnClose}
        onSortChange={handleOrderSortChange}
      />
    </>
  );
};
