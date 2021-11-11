import { FC } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { ScrollbarProps, Scrollbars as RCScrollbars } from 'react-custom-scrollbars-2';

import variables from 'assets/styles/_variables.module.scss';

type Props = ScrollbarProps & {
  viewProps?: BoxProps;
  trackVerticalProps?: BoxProps;
  trackHorizontalProps?: BoxProps;
  thumbVerticalProps?: BoxProps;
  thumbHorizontalProps?: BoxProps;
  hideVerticalScroll?: boolean;
  hideHorizontalScroll?: boolean;
};

export const Scrollbars: FC<Props> = ({
  viewProps,
  trackVerticalProps,
  trackHorizontalProps,
  thumbVerticalProps,
  thumbHorizontalProps,
  hideVerticalScroll,
  hideHorizontalScroll,
  children,
  ...moreProps
}) => (
  <RCScrollbars
    renderTrackVertical={props => (
      <Box
        {...props}
        h='100%'
        right={0}
        backgroundColor={variables.surfaceColor}
        {...trackVerticalProps}
        {...(hideVerticalScroll && { hidden: true })}
      />
    )}
    renderTrackHorizontal={props => (
      <Box
        {...props}
        w='100%'
        bottom={0}
        backgroundColor={variables.surfaceColor}
        {...trackHorizontalProps}
        {...(hideHorizontalScroll && { hidden: true })}
      />
    )}
    renderThumbVertical={props => (
      <Box
        {...props}
        backgroundColor={variables.primaryColor}
        opacity={0.2}
        {...thumbVerticalProps}
      />
    )}
    renderThumbHorizontal={props => (
      <Box
        {...props}
        backgroundColor={variables.primaryColor}
        opacity={0.2}
        {...thumbHorizontalProps}
      />
    )}
    renderView={props => <Box {...props} {...viewProps} />}
    autoHide
    {...moreProps}
  >
    {children}
  </RCScrollbars>
);

Scrollbars.defaultProps = {
  viewProps: undefined,
  trackVerticalProps: undefined,
  trackHorizontalProps: undefined,
  thumbVerticalProps: undefined,
  thumbHorizontalProps: undefined,
  hideVerticalScroll: false,
  hideHorizontalScroll: false
};
