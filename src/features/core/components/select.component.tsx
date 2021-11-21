import { FC, ReactNode, useRef } from 'react';
import RSelect, { Props as SelectProps, StylesConfig } from 'react-select';
import { Flex, InputAddonProps, InputGroup, Tooltip } from '@chakra-ui/react';

import { InputLeftAddon } from './input-left-addon.component';

import variables from 'assets/styles/_variables.module.scss';

const styles: StylesConfig = {
  input: provided => ({
    ...provided,
    color: variables.textColor
  }),
  option: (provided, state) => {
    const backgroundColor = state.isFocused ? variables.inputBgFocusColor : 'transparent';

    return {
      ...provided,
      backgroundColor: state.isSelected ? variables.accentColor : backgroundColor,
      color: variables.textColor,
      fontSize: '14px',
      cursor: 'pointer',
      ':active': {
        backgroundColor: variables.accentColor
      }
    };
  },
  menu: provided => ({
    ...provided,
    backgroundColor: variables.surfaceColor,
    borderRadius: '4px',
    overflow: 'hidden'
  }),
  menuList: provided => ({
    ...provided,
    backgroundColor: variables.inputBgColor
  }),
  singleValue: provided => ({
    ...provided,
    color: variables.textColor
  }),
  container: provided => ({
    ...provided,
    width: '100%'
  }),
  control: (provided, state) => ({
    ...provided,
    padding: 0,
    height: '40px',
    backgroundColor: state.isFocused ? variables.inputBgFocusColor : variables.inputBgColor,
    boxShadow: 'none',
    borderWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: '4px',
    borderBottomRightRadius: '4px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: variables.inputBgFocusColor
    }
  }),
  dropdownIndicator: provided => ({
    ...provided,
    color: variables.textColor,
    opacity: 0.7,
    ':hover': {
      opacity: 0.7
    }
  }),
  clearIndicator: provided => ({
    ...provided,
    color: variables.textColor,
    opacity: 0.7,
    ':hover': {
      opacity: 1
    }
  }),
  indicatorSeparator: provided => ({
    ...provided,
    margin: 0,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)'
  }),
  multiValue: provided => ({
    ...provided,
    backgroundColor: variables.accentColor
  }),
  multiValueLabel: provided => ({
    ...provided,
    color: variables.textColor
  })
};

type Props = SelectProps & {
  leftComponent?: ReactNode | string;
  inputLeftAddonProps?: InputAddonProps;
  error?: string;
};

export const Select: FC<Props> = ({ leftComponent, inputLeftAddonProps, error, ...moreProps }) => {
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
      <RSelect styles={styles} ref={ref} placeholder='' openMenuOnFocus {...moreProps} />
    </InputGroup>
  );
};

Select.defaultProps = {
  leftComponent: undefined,
  inputLeftAddonProps: undefined,
  error: undefined
};
