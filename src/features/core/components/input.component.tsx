import { FC, ReactNode, useRef } from 'react';
import {
  Input as CRInput,
  InputAddonProps,
  InputGroup,
  InputLeftAddon,
  InputProps,
  Tooltip
} from '@chakra-ui/react';

import variables from 'assets/styles/_variables.module.scss';

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
      <Tooltip label={error}>
        <InputLeftAddon
          pos='relative'
          backgroundColor={error ? variables.errorColor : variables.inputBgFocusColor}
          color={error ? variables.textColor : 'rgba(255,255,255,0.7)'}
          fontSize={13}
          textTransform='uppercase'
          borderRadius='4px'
          cursor='text'
          transition='background-color 0.12s ease'
          onClick={() => ref.current?.focus()}
          {...inputLeftAddonProps}
        >
          {leftComponent}
        </InputLeftAddon>
      </Tooltip>
      <CRInput ref={ref} {...moreProps} />
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
