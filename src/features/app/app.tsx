import { FC, Suspense } from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import { theme } from 'config';
import { Header, Scrollbars } from '../core/components';
import { PageContextProvider } from '../core/contexts';
import { withPrerequisite } from './with-prerequisite.hoc';
import { AppRoutes } from './routes';

const Component: FC = () => (
  <PageContextProvider>
    <ChakraProvider theme={theme}>
      <Scrollbars
        className='scrollbar'
        style={{ height: '100vh', width: '100%', zIndex: 999 }}
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

export const App = withPrerequisite(Component);
