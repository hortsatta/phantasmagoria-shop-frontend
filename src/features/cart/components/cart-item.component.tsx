import { ComponentProps, FC, useMemo, useState } from 'react';
import numbro from 'numbro';
import { Badge, Box, Flex, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { X as XSvg } from 'phosphor-react';

import { CartItem as CartItemModel } from 'models';
import { MotionSurface } from 'features/core/components';
import { Quantity } from './quantity.component';

import variables from 'assets/styles/_variables.module.scss';

type Props = ComponentProps<typeof MotionSurface> & {
  cartItem: CartItemModel;
};

const formatCurrency = (price: number) =>
  numbro(price).formatCurrency({
    currencySymbol: '\u20B1',
    thousandSeparated: true,
    mantissa: 2
  });

export const CartItem: FC<Props> = ({ cartItem, ...moreProps }) => {
  const { quantity, cardProduct } = cartItem;
  const { name, price, image, cards } = cardProduct;
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const itemImage = useMemo(() => image?.url || cards[0].coverImage.url, [cardProduct]);
  const itemTotal = useMemo(() => currentQuantity * price, [currentQuantity, price]);

  const handleDecrement = () => {
    setCurrentQuantity(currentQuantity - 1);
  };

  const handleIncrement = () => {
    setCurrentQuantity(currentQuantity + 1);
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
              {formatCurrency(price)}
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
          <Text fontSize='md'>{formatCurrency(itemTotal)}</Text>
        </Box>
      </Flex>
    </MotionSurface>
  );
};
