import { FC, useContext, useEffect, useMemo } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Center, Flex, Heading } from '@chakra-ui/react';

import { appModulesVar } from 'config';
import { signOut } from 'services';
import { PageContext } from 'features/core/contexts';
import { useDebounce } from 'features/core/hooks';
import { PageBox, Surface } from 'features/core/components';
import { EditUserAccountForm } from '../components';
import { useGetUser, useEditUser } from '../hooks';

export const UserAccountPage: FC = () => {
  const { changePage } = useContext(PageContext);
  const { debounce } = useDebounce();
  const { userAccount, loading: getUserLoading } = useGetUser();
  const { updateUserAccount, updateAddress, loading: editUserLoading } = useEditUser();
  const appModules: any = useReactiveVar(appModulesVar);

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

  const handleSignOut = () => {
    debounce(() => {
      signOut();
      const shopListNav = appModules.shop.children?.list;
      changePage(shopListNav?.key, shopListNav?.path);
    });
  };

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
            Account
          </Heading>
        </Center>
        <Surface p={12} w='100%'>
          {userAccount && (
            <EditUserAccountForm
              w='100%'
              userAccount={userAccount}
              loading={loading}
              onUpdateUserAccount={updateUserAccount}
              onUpdateAddress={updateAddress}
            />
          )}
        </Surface>
      </Flex>
    </PageBox>
  );
};
