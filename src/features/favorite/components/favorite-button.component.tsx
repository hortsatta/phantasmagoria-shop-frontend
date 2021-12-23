import { ComponentProps, FC, useEffect, useRef } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import Lottie from 'lottie-react';

import { IconButton } from 'features/core/components';

import variables from 'assets/styles/_variables.module.scss';
import lottieFavFireworks from 'assets/images/lottie-fav-fireworks.json';

type Props = Omit<ComponentProps<typeof IconButton>, 'onClick'> & {
  isActive?: boolean;
  wrapperProps?: BoxProps;
  fxScale?: number;
  onClick?: () => void;
};

export const FavoriteButton: FC<Props> = ({
  isActive,
  fxScale,
  wrapperProps,
  onClick,
  ...moreProps
}) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    ref.current?.stop();
    ref.current?.setSpeed(1.5);
  }, []);

  const handleClick = () => {
    !isActive && ref.current?.playSegments([0, 35, true]);
    onClick && onClick();
  };

  return (
    <Box pos='relative' {...wrapperProps}>
      <IconButton
        onClick={handleClick}
        {...(isActive && { color: variables.primaryColor })}
        {...moreProps}
      />
      <Lottie
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `scale(${fxScale})`
        }}
        lottieRef={ref}
        animationData={lottieFavFireworks}
        autoPlay={false}
        loop={false}
      />
    </Box>
  );
};

FavoriteButton.defaultProps = {
  isActive: false,
  wrapperProps: undefined,
  fxScale: 1.3,
  onClick: undefined
};
