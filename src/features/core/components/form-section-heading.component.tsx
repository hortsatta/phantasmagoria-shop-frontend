import { FC } from 'react';
import { Box, Heading, Divider, BoxProps } from '@chakra-ui/react';

export const FormSectionHeading: FC<BoxProps> = ({ children, ...moreProps }) => (
  <Box py={4} {...moreProps}>
    <Heading fontSize='2xl' as='h6'>
      {children}
    </Heading>
    <Divider />
  </Box>
);
