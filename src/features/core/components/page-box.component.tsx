import { FC, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, BoxProps } from '@chakra-ui/react';

import { APP_DESCRIPTION, APP_TITLE } from 'config';
import { PageContext } from '../contexts';

type Props = BoxProps & {
  pageTitle?: string;
  pageDescription?: string;
};

export const PageBox: FC<Props> = ({ pageTitle, pageDescription, children, ...moreProps }) => {
  const { pageLoading, showPage } = useContext(PageContext);

  useEffect(() => {
    showPage();
  }, []);

  return (
    <Box pb='60px' opacity={pageLoading ? 0 : 1} transition='opacity 0.3s' {...moreProps}>
      {(pageTitle || pageDescription) && (
        <Helmet>
          <title>{pageTitle ? `${pageTitle} • ${APP_TITLE}` : APP_TITLE}</title>
          <meta name='description' content={pageDescription || APP_DESCRIPTION} />
        </Helmet>
      )}
      {children}
    </Box>
  );
};

PageBox.defaultProps = {
  pageTitle: undefined,
  pageDescription: undefined
};
