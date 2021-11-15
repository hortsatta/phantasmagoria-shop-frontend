import { extendTheme } from '@chakra-ui/react';
import { StepsStyleConfig } from 'chakra-ui-steps';

import variables from 'assets/styles/_variables.module.scss';

const styles = {
  global: {
    body: {
      bg: variables.backgroundColor,
      color: variables.textColor
    }
  }
};

const fonts = {
  heading: variables.accentFont,
  body: variables.textFont
};

const colors = {
  brand: {
    100: variables.primaryColor,
    200: variables.accentColor
  }
};

const Button = {
  baseStyle: {
    fontWeight: 400,
    textTransform: 'uppercase',
    lineHeight: 1,
    borderRadius: 4
  },
  variants: {
    solid: {
      _active: { backgroundColor: variables.accentColor },
      _focus: { backgroundColor: variables.accentColor, boxShadow: 0 },
      _hover: { backgroundColor: variables.primaryColor },
      backgroundColor: variables.accentColor
    },
    ghost: {
      _active: { backgroundColor: 'rgba(0,0,0,0)' },
      _focus: { boxShadow: 0 },
      _hover: { backgroundColor: 'rgba(0,0,0,0)', color: variables.primaryColor }
    }
  }
};

const Divider = {
  baseStyle: {
    opacity: 0.06
  }
};

const Heading = {
  baseStyle: {
    textTransform: 'lowercase'
  }
};

const Input = {
  baseStyle: {
    field: {
      color: variables.textColor
    }
  },
  variants: {
    filled: {
      field: {
        _focus: { backgroundColor: variables.inputBgFocusColor },
        _hover: { backgroundColor: variables.inputBgFocusColor },
        paddingBottom: '2px',
        background: variables.inputBgColor,
        borderRadius: 4,
        borderWidth: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
      }
    }
  },
  defaultProps: {
    variant: 'filled'
  }
};

const Link = {
  baseStyle: {
    _focus: { boxShadow: 0 }
  }
};

const Steps = {
  ...StepsStyleConfig,
  baseStyle: (props: any) => {
    const { connector, label, stepIconContainer, ...moreBaseStyle } =
      StepsStyleConfig.baseStyle(props);

    return {
      ...moreBaseStyle,
      connector: {
        ...connector,
        borderColor: variables.inputBgFocusColor,
        _highlighted: { borderColor: variables.primaryColor }
      },
      label: {
        ...label,
        color: variables.textColor,
        fontFamily: variables.textFont
      },
      steps: { mx: 'auto', mb: 8, maxW: '3xl' },
      stepIconContainer: {
        ...stepIconContainer,
        '&[data-clickable]:hover': {
          borderColor: variables.primaryColor
        },
        bg: variables.inputBgFocusColor,
        borderColor: variables.inputBgFocusColor,
        _activeStep: { borderColor: variables.primaryColor },
        _highlighted: {
          bg: variables.primaryColor,
          borderColor: variables.primaryColor
        }
      }
    };
  }
};

export const theme = extendTheme({
  initialColorMode: 'dark',
  useSystemColorMode: false,
  styles,
  fonts,
  colors,
  components: {
    Button,
    Divider,
    Heading,
    Input,
    Link,
    Steps
  }
});
