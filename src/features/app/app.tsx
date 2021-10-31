import { FC, Suspense } from 'react';
import { Box, ChakraProvider, extendTheme } from '@chakra-ui/react';

import { theme } from 'config';
import { Header } from 'features/core/components';
import { AppRoutes } from './routes';

export const App: FC = () => {
  return (
    <ChakraProvider theme={extendTheme(theme)}>
      <Box>
        <Header />
        <Suspense fallback={null}>
          <AppRoutes />
        </Suspense>
      </Box>
    </ChakraProvider>
  );
};
