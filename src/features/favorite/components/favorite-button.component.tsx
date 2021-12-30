import { ComponentProps, FC, useCallback } from 'react';
import { Box, BoxProps, Flex, FlexProps } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import { Knife } from 'phosphor-react';

import { useDebounce } from 'features/core/hooks';
import { Icon, IconButton } from 'features/core/components';

import variables from 'assets/styles/_variables.module.scss';

type Props = Omit<ComponentProps<typeof IconButton>, 'onClick'> & {
  isActive?: boolean;
  wrapperProps?: BoxProps;
  onClick?: () => void;
};

const MotionFlex = motion<Omit<FlexProps, 'transition'>>(Flex);

export const FavoriteButton: FC<Props> = ({ isActive, wrapperProps, onClick, ...moreProps }) => {
  const iconControls = useAnimation();
  const pingControls = useAnimation();
  const { debounce, loading: debounceLoading } = useDebounce();

  const handleClick = useCallback(() => {
    if (debounceLoading) {
      return;
    }

    debounce(() => null, 500);
    iconControls.start({ rotate: ['0deg', '360deg'] });
    pingControls.start({
      opacity: [1, 1, 0],
      scale: [0, 0.6, 0.8],
      borderWidth: [15, 1]
    });
    onClick && onClick();
  }, [onClick, debounce, debounceLoading]);

  return (
    <Box {...wrapperProps}>
      <Box pos='relative' w='100%' h='100%'>
        <IconButton
          onClick={handleClick}
          pos='absolute'
          left={0}
          top={0}
          zIndex={3}
          {...moreProps}
        />
        <MotionFlex
          w='100%'
          h='100%'
          justifyContent='center'
          alignItems='center'
          initial={false}
          zIndex={2}
          animate={iconControls}
          transition={{ duration: 0.4, ease: 'linear' }}
        >
          <Icon
            w={6}
            color={variables.textColor}
            boxSizing='content-box'
            as={Knife}
            {...(isActive && { color: variables.primaryColor })}
          />
        </MotionFlex>
        <Flex
          d='flex'
          alignItems='center'
          justifyContent='center'
          pos='absolute'
          w='100%'
          h='100%'
          top={0}
          left={0}
        >
          <MotionFlex
            w='50px'
            h='50px'
            borderRadius='99px'
            borderColor={variables.primaryColor}
            borderWidth='1px'
            zIndex={1}
            initial={{ scale: 0 }}
            animate={pingControls}
            transition={{ duration: 0.6, ease: 'linear' }}
          />
        </Flex>
      </Box>
    </Box>
  );
};

FavoriteButton.defaultProps = {
  isActive: false,
  wrapperProps: undefined,
  onClick: undefined
};
