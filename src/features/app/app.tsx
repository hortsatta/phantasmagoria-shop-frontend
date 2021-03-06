import { FC, Suspense } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import { theme } from 'config';
import { Header, Notifications, Scrollbars } from '../core/components';
import { PageContextProvider } from '../core/contexts';
import { useEffectUpsertCart } from '../cart/hooks';
import { useEffectUpsertFavorite } from '../favorite/hooks';
import { withPrerequisite } from './with-prerequisite.hoc';
import { AppRoutes } from './routes';

const Component: FC = () => {
  useEffectUpsertCart();
  useEffectUpsertFavorite();

  return (
    <PageContextProvider>
      <ChakraProvider theme={extendTheme(theme)}>
        <Scrollbars
          className='scrollbar'
          style={{ height: '100vh', width: '100%', zIndex: 999 }}
          viewProps={{ pt: '61px' }}
          trackVerticalProps={{ zIndex: 4 }}
          hideHorizontalScroll
        >
          <Header />
          <Suspense fallback={null}>
            <AppRoutes />
          </Suspense>
        </Scrollbars>
        <Notifications />
      </ChakraProvider>
    </PageContextProvider>
  );
};

export const App = withPrerequisite(Component);
