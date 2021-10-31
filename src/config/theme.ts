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

export const theme = {
  styles,
  fonts,
  colors
};
