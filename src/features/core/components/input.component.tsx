import { FC, ReactNode, useRef } from 'react';
import {
  Flex,
  Input as ChakraInput,
  InputAddonProps,
  InputGroup,
  InputProps,
  Tooltip
} from '@chakra-ui/react';

import { InputLeftAddon } from './input-left-addon.component';

type Props = InputProps & {
  leftComponent?: ReactNode | string;
  rightComponent?: ReactNode | string;
  inputLeftAddonProps?: InputAddonProps;
  error?: string;
};

export const Input: FC<Props> = ({
  leftComponent,
  rightComponent,
  inputLeftAddonProps,
  error,
  ...moreProps
}) => {
  const ref = useRef<any>(null);

  return (
    <InputGroup>
      <InputLeftAddon
        px={0}
        cursor='text'
        error={error}
        onClick={() => ref.current?.focus()}
        {...inputLeftAddonProps}
      >
        <Tooltip label={error}>
          <Flex alignItems='center' px={4} w='100%' h='100%'>
            {leftComponent}
          </Flex>
        </Tooltip>
      </InputLeftAddon>
      <ChakraInput ref={ref} {...moreProps} />
      {rightComponent}
    </InputGroup>
  );
};

Input.defaultProps = {
  leftComponent: undefined,
  rightComponent: undefined,
  inputLeftAddonProps: undefined,
  error: undefined
};
