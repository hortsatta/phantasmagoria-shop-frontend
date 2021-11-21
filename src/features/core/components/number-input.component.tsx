import { FC, ReactNode, useRef } from 'react';
import {
  Flex,
  InputAddonProps,
  InputGroup,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput as ChakraNumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
  Tooltip
} from '@chakra-ui/react';

import { InputLeftAddon } from './input-left-addon.component';

type Props = NumberInputProps & {
  leftComponent?: ReactNode | string;
  rightComponent?: ReactNode | string;
  inputLeftAddonProps?: InputAddonProps;
  error?: string;
};

export const NumberInput: FC<Props> = ({
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
      <ChakraNumberInput flex={1} {...moreProps}>
        <NumberInputField ref={ref} />
        <NumberInputStepper>
          <NumberIncrementStepper
            color='rgba(255,255,255,0.6)'
            borderColor='rgba(255,255,255,0.1)'
          />
          <NumberDecrementStepper
            color='rgba(255,255,255,0.6)'
            borderColor='rgba(255,255,255,0.1)'
          />
        </NumberInputStepper>
      </ChakraNumberInput>
      {rightComponent}
    </InputGroup>
  );
};

NumberInput.defaultProps = {
  leftComponent: undefined,
  rightComponent: undefined,
  inputLeftAddonProps: undefined,
  error: undefined
};
