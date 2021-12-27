import { ComponentProps, FC, useMemo } from 'react';
import { Badge, Box, Flex, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { X as XSvg } from 'phosphor-react';

import { formatPrice } from 'helpers';
import { MotionSurface } from 'features/core/components';
import { CartItemFormData } from './cart-form.component';
import { Quantity } from './quantity.component';

import variables from 'assets/styles/_variables.module.scss';

type Props = ComponentProps<typeof MotionSurface> & {
  cartItem: CartItemFormData;
  onChange: (cartItem: CartItemFormData) => void;
};

export const CartItem: FC<Props> = ({ cartItem, onChange, ...moreProps }) => {
  const { currentQuantity, cardProduct } = cartItem;
  const { name, price, image, cards } = cardProduct;
  const itemImage = useMemo(() => image?.url || cards[0].coverImage.url, [cardProduct]);
  const itemTotal = useMemo(() => currentQuantity * price, [currentQuantity, price]);

  const handleDecrement = () => {
    const cq = currentQuantity > 1 ? currentQuantity - 1 : 0;
    onChange({ ...cartItem, currentQuantity: cq });
  };

  const handleIncrement = () => {
    onChange({ ...cartItem, currentQuantity: currentQuantity + 1 });
  };

  return (
    <MotionSurface
      justifyContent='flex-start'
      alignItems='center'
      w='100%'
      h='80px'
      bgColor={variables.inputBgFocusColor}
      borderRadius={4}
      overflow='hidden'
      initial={{ opacity: 0, transform: 'translateX(-32px)' }}
      animate={{ opacity: 1, transform: 'translateX(0px)' }}
      layout
      {...moreProps}
    >
      <Box mr={4} h='100%' w='103px' bgColor={variables.bgColor}>
        {itemImage && <Image src={itemImage} objectFit='cover' />}
      </Box>
      <Flex pr={4} flex={1} alignItems='center' justifyContent='space-between'>
        <HStack>
          <VStack flexGrow={0} w='150px' alignItems='flex-start'>
            <Text flex={1} fontSize={18}>
              {name}
            </Text>
            <Badge fontSize='md' variant='subtle'>
              {formatPrice(price)}
            </Badge>
          </VStack>
          <Box pr={8}>
            <XSvg width='30' height='30' opacity={0.15} />
          </Box>
          <Quantity
            value={currentQuantity}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
        </HStack>
        <Box
          flexGrow={0}
          py={2}
          minW='130px'
          textAlign='center'
          borderRadius='999px'
          overflow='hidden'
          bgColor={variables.accentColor}
        >
          <Text>{formatPrice(itemTotal)}</Text>
        </Box>
      </Flex>
    </MotionSurface>
  );
};
