import { ComponentProps, FC, useCallback } from 'react';
import { Box, BoxProps, Flex, FlexProps, Text } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';

import { useDebounce } from 'features/core/hooks';
import { IconButton } from 'features/core/components';

import variables from 'assets/styles/_variables.module.scss';

type Props = Omit<ComponentProps<typeof IconButton>, 'onClick'> & {
  wrapperProps?: BoxProps;
  onClick?: () => void;
};

const MotionFlex = motion<Omit<FlexProps, 'transition'>>(Flex);

export const AddToCartButton: FC<Props> = ({ wrapperProps, onClick, ...moreProps }) => {
  const controls = useAnimation();
  const { debounce, loading: debounceLoading } = useDebounce();

  const handleClick = useCallback(() => {
    if (debounceLoading) {
      return;
    }

    debounce(() => null, 500);
    controls.start({
      opacity: [1, 1, 1, 1, 1, 0],
      scale: [0, 1.2, 1, 1, 1, 0],
      y: [10, 8, 6, -5, -10, -10],
      zIndex: [2]
    });
    onClick && onClick();
  }, [onClick, debounce, debounceLoading]);

  return (
    <Box pos='relative' {...wrapperProps}>
      <IconButton onClick={handleClick} {...moreProps} />
      <MotionFlex
        alignItems='center'
        justifyContent='center'
        pos='absolute'
        right={1}
        top={1}
        w={7}
        h={7}
        bgColor={variables.primaryColor}
        borderRadius='99px'
        overflow='hidden'
        opacity={0}
        zIndex={-1}
        initial={false}
        animate={controls}
        transition={{ duration: 1, ease: 'linear', times: [0, 0.1, 0.15, 0.2, 0.8, 1] }}
      >
        <Text mr='2px'>+1</Text>
      </MotionFlex>
    </Box>
  );
};

AddToCartButton.defaultProps = {
  wrapperProps: undefined,
  onClick: undefined
};
