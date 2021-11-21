import { FC, useContext, useEffect } from 'react';
import { Link as ReactLink } from 'react-router-dom';
import { Center, Flex, Heading, Image, Link } from '@chakra-ui/react';
import { useMutation, useReactiveVar } from '@apollo/client';

import { currentUserVar } from 'config';
import { signIn } from 'services';
import { SIGN_IN } from 'services/graphql';
import { PageContext } from 'features/core/contexts';
import { useDebounce } from 'features/core/hooks';
import { navConfig, PageBox, SubHeading, Surface } from 'features/core/components';
import { SignInForm } from '../components';

import signInCover from 'assets/images/sign-in-cover.jpg';

export const AuthPage: FC = () => {
  const { debounce, loading: debounceLoading } = useDebounce();
  const { changePage } = useContext(PageContext);
  const [login, { loading, error }] = useMutation(SIGN_IN);
  const currentUser = useReactiveVar(currentUserVar);

  useEffect(() => {
    if (debounceLoading || loading || !currentUser) {
      return;
    }

    const shopListNav = navConfig.shop.children?.list;
    changePage(shopListNav?.key, shopListNav?.path);
  }, [currentUser, debounceLoading, loading]);

  const handleSubmit = async (identifier: string, password: string) => {
    try {
      debounce();
      const { data } = await login({ variables: { identifier, password } });
      const { jwt, user } = data.login;
      signIn(jwt, user);
    } catch (err) {
      // TODO
      console.log('err', err);
    }
  };

  return (
    <PageBox>
      <Surface flexDir='column' alignItems='flex-start' m='6rem auto 0 auto' w='xl'>
        <Flex d='flex' flexDir='column' alignItems='center' py={8} px={8} w='100%'>
          <Center flexDir='column' flex={1} mb={12}>
            <Heading as='h2' fontSize='4xl'>
              Sign In
            </Heading>
            <SubHeading>Enter your details below to continue.</SubHeading>
          </Center>
          <SignInForm
            mb={2}
            w='100%'
            loading={loading || debounceLoading}
            onSubmit={handleSubmit}
          />
          <Link
            fontSize={14}
            opacity={0.8}
            as={ReactLink}
            to={`${navConfig.user.path}${navConfig.user.children?.signUp.path}` || ''}
          >
            I don&apos;t have an account, sign me up.
          </Link>
        </Flex>
        <Image w='100%' h={120} objectFit='cover' src={signInCover} />
      </Surface>
    </PageBox>
  );
};
