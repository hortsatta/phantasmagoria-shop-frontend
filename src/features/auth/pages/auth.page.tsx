import { FC, useContext, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Center, Flex, Heading, Image, Link } from '@chakra-ui/react';
import { useReactiveVar } from '@apollo/client';

import { appModulesVar, currentUserVar } from 'config';
import { PageContext } from 'features/core/contexts';
import { PageBox, SubHeading, Surface } from 'features/core/components';
import { useAuth } from '../hooks';
import { SignInForm } from '../components';

import signInCover from 'assets/images/sign-in-cover.jpg';

export const AuthPage: FC = () => {
  const { changePage } = useContext(PageContext);
  const { signIn, loading } = useAuth();
  const currentUser = useReactiveVar(currentUserVar);
  const appModules: any = useReactiveVar(appModulesVar);

  useEffect(() => {
    if (loading || !currentUser) {
      return;
    }

    const shopListNav = appModules.shop.children?.list;
    changePage(shopListNav?.key, shopListNav?.path);
  }, [currentUser, loading]);

  return (
    <PageBox>
      <Surface
        flexDir='column'
        alignItems='flex-start'
        m='6rem auto 0 auto'
        w='xl'
        overflow='hidden'
      >
        <Flex d='flex' flexDir='column' alignItems='center' py={8} px={8} w='100%'>
          <Center flexDir='column' flex={1} mb={12}>
            <Heading as='h2' fontSize='4xl'>
              Sign In
            </Heading>
            <SubHeading>Enter your details below to continue.</SubHeading>
          </Center>
          <SignInForm mb={2} w='100%' loading={loading} onSubmit={signIn} />
          <Link
            fontSize={14}
            opacity={0.8}
            as={RouterLink}
            to={`${appModules.user.path}${appModules.user.children?.signUp.path}` || ''}
          >
            I don&apos;t have an account, sign me up.
          </Link>
        </Flex>
        <Image w='100%' h={120} objectFit='cover' src={signInCover} />
      </Surface>
    </PageBox>
  );
};
