import { FC, Suspense } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import { theme } from 'config';
import { Header, Scrollbars } from '../core/components';
import { PageContextProvider } from '../core/contexts';
import { AppRoutes } from './routes';

export const App: FC = () => {
  return (
    <PageContextProvider>
      <ChakraProvider theme={extendTheme(theme)}>
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
