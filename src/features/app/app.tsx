import { FC, Suspense } from 'react';
import { Box, ChakraProvider, extendTheme } from '@chakra-ui/react';

import { theme } from 'config';
import { Header } from '../core/components';
import { PageContextProvider } from '../core/contexts';
import { AppRoutes } from './routes';

export const App: FC = () => {
  return (
    <PageContextProvider>
      <ChakraProvider theme={extendTheme(theme)}>
        <Box pt='61px'>
          <Header />
          <Suspense fallback={null}>
            <AppRoutes />
          </Suspense>
        </Box>
      </ChakraProvider>
    </PageContextProvider>
  );
};
