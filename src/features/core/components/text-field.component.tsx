import { FC } from 'react';
import { Box, BoxProps, Divider, Text, TextProps } from '@chakra-ui/react';

import variables from 'assets/styles/_variables.module.scss';

type Props = TextProps & {
  label?: string;
  wrapperProps?: BoxProps;
  labelProps?: TextProps;
};

export const TextField: FC<Props> = ({
  label,
  wrapperProps,
  labelProps,
  children,
  ...moreProps
}) => (
  <Box
    px={4}
    py={3}
    bgColor={variables.inputBgColor}
    borderRadius='4px'
    overflow='hidden'
    {...wrapperProps}
  >
    <Text lineHeight={1} {...moreProps}>
      {children}
    </Text>
    <Divider my={2} bgColor='rgba(255,255,255,0.1)' />
    <Text
      color='rgba(255,255,255,0.7)'
      fontSize={12}
      textTransform='uppercase'
      lineHeight={1}
      {...labelProps}
    >
      {label}
    </Text>
  </Box>
);

TextField.defaultProps = {
  label: '',
  wrapperProps: undefined,
  labelProps: undefined
};
