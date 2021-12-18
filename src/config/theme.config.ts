import { theme as chakraTheme } from '@chakra-ui/react';
import { StepsStyleConfig } from 'chakra-ui-steps';
import variables from 'assets/styles/_variables.module.scss';

const styles = {
  global: {
    body: {
      bg: variables.bgColor,
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

const alertStyles = {
  title: {
    mb: 2,
    fontSize: '3xl',
    fontFamily: variables.primaryFont,
    fontWeight: 400
  },
  icon: {
    w: 0,
    color: variables.textColor,
    overflow: 'hidden'
  }
};

const Alert = {
  variants: {
    subtle: (props: any) => {
      const { colorScheme } = props;

      let typeStyles = {};
      switch (colorScheme) {
        case 'green':
          typeStyles = {
            container: {
              bg: variables.successColor
            }
          };
          break;
        case 'red':
          typeStyles = {
            container: {
              bg: variables.errorColor
            }
          };
          break;
        case 'orange':
          typeStyles = {
            container: {
              bg: variables.warningColor
            }
          };
          break;
        default:
          break;
      }

      return {
        ...chakraTheme.components.Alert.variants.subtle(props),
        ...alertStyles,
        ...typeStyles
      };
    }
  }
};

const Badge = {
  variants: {
    subtle: {
      color: '#c0aec7',
      bgColor: '#28131b'
    }
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
      _active: { bgColor: variables.accentColor },
      _focus: { bgColor: variables.accentColor, boxShadow: 0 },
      _hover: { bgColor: variables.primaryColor },
      bgColor: variables.accentColor
    },
    ghost: {
      _active: { bgColor: 'rgba(0,0,0,0)' },
      _focus: { boxShadow: 0 },
      _hover: { bgColor: 'rgba(0,0,0,0)', color: variables.primaryColor }
    }
  }
};

const Divider = {
  baseStyle: {
    opacity: 0.3
  }
};

const Heading = {
  baseStyle: {
    textTransform: 'lowercase',
    lineHeight: 1
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
        _focus: { bgColor: variables.inputBgFocusColor },
        _hover: { bgColor: variables.inputBgFocusColor },
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

const Spinner = {
  baseStyle: {
    color: variables.primaryColor
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
      steps: {
        mx: 'auto',
        mb: 8,
        px: 4,
        maxW: '3xl'
      },
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

const messages = {
  signInFailed: 'Please check your credentials.',
  problem: `We've encountered a problem. Please try again.`
};

const theme = {
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false
  },
  styles,
  fonts,
  colors,
  components: {
    Alert,
    Badge,
    Button,
    Divider,
    Heading,
    Input,
    NumberInput: Input,
    Link,
    Spinner,
    Steps
  }
};

export { theme, messages };
