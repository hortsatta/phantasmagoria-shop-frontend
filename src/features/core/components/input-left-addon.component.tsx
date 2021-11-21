import { FC } from 'react';
import { InputLeftAddon as ChakraInputLeftAddon, InputAddonProps } from '@chakra-ui/react';

import variables from 'assets/styles/_variables.module.scss';

type Props = InputAddonProps & {
  error?: string;
};

export const InputLeftAddon: FC<Props> = ({ error, children, ...moreProps }) => (
  <ChakraInputLeftAddon
    pos='relative'
    backgroundColor={error ? variables.errorColor : variables.inputBgFocusColor}
    color={error ? variables.textColor : 'rgba(255,255,255,0.7)'}
    fontSize={13}
    textTransform='uppercase'
    borderRadius='4px'
    cursor='text'
    transition='background-color 0.12s ease'
    {...moreProps}
  >
    {children}
  </ChakraInputLeftAddon>
);

InputLeftAddon.defaultProps = {
  error: undefined
};
