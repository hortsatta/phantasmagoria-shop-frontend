import { FC, useContext, useEffect } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { PageContext } from '../contexts';

export const PageBox: FC<BoxProps> = ({ children, ...moreProps }) => {
  const { pageLoading, showPage } = useContext(PageContext);

  useEffect(() => {
    showPage();
  }, []);

  return (
    <Box pb='60px' opacity={pageLoading ? 0 : 1} transition='opacity 0.3s' {...moreProps}>
      {children}
    </Box>
  );
};
