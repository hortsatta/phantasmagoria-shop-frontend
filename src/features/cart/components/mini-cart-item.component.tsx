import { ComponentProps, FC, useMemo } from 'react';
import { Badge, Box, Flex, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { X as XSvg } from 'phosphor-react';

import { formatPrice } from 'helpers';
import { MotionSurface } from 'features/core/components';
import { CartItemFormData } from './cart-form.component';

import variables from 'assets/styles/_variables.module.scss';

type Props = ComponentProps<typeof MotionSurface> & {
  cartItem: CartItemFormData;
};

export const MiniCartItem: FC<Props> = ({ cartItem, onChange, ...moreProps }) => {
  const { quantity = 0, currentQuantity = 0, cardProduct } = cartItem || {};
  const { name, price, image, cards = [] } = cardProduct || {};
  const itemImage = useMemo(() => image?.url || cards[0]?.coverImage.url, [cardProduct]);
  const itemQuantity = useMemo(() => quantity + currentQuantity, [quantity, currentQuantity]);
  const itemTotal = useMemo(() => itemQuantity * price, [itemQuantity, price]);

  return (
    <MotionSurface
      pos='relative'
      justifyContent='flex-start'
      alignItems='center'
      w='100%'
      h='40px'
      bgColor={variables.inputBgFocusColor}
      borderRadius={4}
      overflow='hidden'
      initial={{ opacity: 0, transform: 'translateX(-32px)' }}
      animate={{ opacity: 1, transform: 'translateX(0px)' }}
      layout
      {...moreProps}
    >
      <Box mr={4} w='52px'>
        {itemImage && <Image src={itemImage} objectFit='cover' />}
      </Box>
      <Flex h='100%' flex={1} alignItems='center' justifyContent='space-between'>
        <HStack h='100%'>
          <Text w='200px' flex={1} fontSize={18}>
            {name}
          </Text>
          <HStack h='100%' spacing={4}>
            <Badge
              d='flex'
              alignItems='center'
              justifyContent='center'
              minW='80px'
              h='80%'
              fontSize='md'
              textAlign='center'
              variant='subtle'
            >
              {formatPrice(price)}
            </Badge>
            <XSvg width='30' height='30' opacity={0.15} />
            <Text minW='20px' textAlign='center' lineHeight={1}>
              {itemQuantity}
            </Text>
          </HStack>
        </HStack>
        <Flex
          pr={4}
          flexGrow={0}
          alignItems='center'
          justifyContent='flex-end'
          minW='100px'
          h='100%'
          bgColor={variables.accentColor}
          borderTopLeftRadius='99px'
          borderBottomLeftRadius='99px'
          overflow='hidden'
        >
          <Text lineHeight={1}>{formatPrice(itemTotal)}</Text>
        </Flex>
      </Flex>
    </MotionSurface>
  );
};
