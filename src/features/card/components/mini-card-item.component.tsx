import { ComponentProps, FC, ReactNode, useMemo } from 'react';
import { Badge, Box, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { X as XSvg } from 'phosphor-react';

import { Card } from 'models';
import { MotionSurface } from 'features/core/components';

import variables from 'assets/styles/_variables.module.scss';

type Props = ComponentProps<typeof MotionSurface> & {
  card: Card;
  rightComponent?: ReactNode;
};

export const MiniCardItem: FC<Props> = ({ card, rightComponent, ...moreProps }) => {
  const { name, coverImage, rarity, category } = card;
  const coverImageUri = useMemo(
    () => coverImage && `${process.env.REACT_APP_CLOUDINARY_URI}thumbnail_${coverImage?.hash}.jpg`,
    [coverImage]
  );

  return (
    <MotionSurface
      justifyContent='flex-start'
      alignItems='center'
      h='60px'
      bgColor={variables.inputBgFocusColor}
      borderRadius={4}
      overflow='hidden'
      initial={{ opacity: 0, transform: 'translateX(-32px)' }}
      animate={{ opacity: 1, transform: 'translateX(0px)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, type: 'tween' } as any}
      layout
      {...moreProps}
    >
      <Box mr={4} h='100%' w='77px' bgColor='#28131b'>
        {coverImageUri && <Image src={coverImageUri} objectFit='cover' />}
      </Box>
      <VStack flex={1} alignItems='flex-start'>
        <Text flex={1} lineHeight={1}>
          {name}
        </Text>
        <HStack>
          <Badge variant='subtle'>{rarity?.name}</Badge>
          <XSvg opacity={0.3} />
          <Badge variant='subtle'>{category?.name}</Badge>
        </HStack>
      </VStack>
      {rightComponent}
    </MotionSurface>
  );
};

MiniCardItem.defaultProps = {
  rightComponent: undefined
};
