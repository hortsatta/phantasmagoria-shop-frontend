import { FC, ReactNode } from 'react';
import { Box, Flex, FlexProps, Heading, Divider, BoxProps, HeadingProps } from '@chakra-ui/react';

type Props = BoxProps & {
  rightComponent?: ReactNode;
  flexProps?: FlexProps;
  headingProps?: HeadingProps;
};

export const FormSectionHeading: FC<Props> = ({
  rightComponent,
  flexProps,
  headingProps,
  children,
  ...moreProps
}) => (
  <Box py={4} {...moreProps}>
    <Flex justifyContent='space-between' alignItems='center' {...flexProps}>
      <Heading flex={1} fontSize='2xl' as='h6' {...headingProps}>
        {children}
      </Heading>
      {rightComponent}
    </Flex>
    <Divider />
  </Box>
);

FormSectionHeading.defaultProps = {
  rightComponent: undefined,
  flexProps: undefined,
  headingProps: undefined
};
