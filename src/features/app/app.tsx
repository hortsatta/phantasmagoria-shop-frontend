import { FC, Suspense, useEffect } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';

import { currentUserVar, theme } from 'config';
import { CHECK_SESSION } from 'services';
import { Header, Scrollbars } from '../core/components';
import { PageContextProvider } from '../core/contexts';
import { AppRoutes } from './routes';

export const App: FC = () => {
  const { loading, data } = useQuery(CHECK_SESSION);
  const currentUser = useReactiveVar(currentUserVar);

  useEffect(() => {
    if (typeof currentUser !== 'undefined') {
      return;
    }

    // If user is logged in, set current user
    currentUserVar(data?.me || null);
  }, [currentUser, data]);

  if (typeof currentUser === 'undefined' || loading) {
    return null;
  }

  return (
    <PageContextProvider>
      <ChakraProvider theme={theme}>
        <Scrollbars
          style={{ height: '100vh', width: '100%' }}
          viewProps={{ pt: '61px' }}
          hideHorizontalScroll
        >
          <Header />
          <Suspense fallback={null}>
            <AppRoutes />
          </Suspense>
        </Scrollbars>
      </ChakraProvider>
    </PageContextProvider>
  );
};
