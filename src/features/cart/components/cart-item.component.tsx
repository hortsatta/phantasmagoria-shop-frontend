import { ComponentProps, FC, useCallback, useMemo } from 'react';
import { Badge, Box, Flex, HStack, Image, Spinner, Text, VStack } from '@chakra-ui/react';
import { X as XSvg } from 'phosphor-react';

import { formatPrice } from 'helpers';
import { RemoveIconButton, MotionSurface } from 'features/core/components';
import { CartItemFormData } from './cart-form.component';
import { Quantity } from './quantity.component';

import variables from 'assets/styles/_variables.module.scss';

type Props = Omit<ComponentProps<typeof MotionSurface>, 'onChange'> & {
  cartItem: CartItemFormData;
  onChange?: (cartItem: CartItemFormData) => void;
};

export const CartItem: FC<Props> = ({ cartItem, onChange, ...moreProps }) => {
  const { quantity = 0, currentQuantity = 0, cardProduct } = cartItem || {};
  const { name, price, image, cards = [] } = cardProduct || {};
  const itemImage = useMemo(() => image?.url || cards[0]?.coverImage.url, [cardProduct]);
  const itemQuantity = useMemo(() => quantity + currentQuantity, [quantity, currentQuantity]);
  const itemTotal = useMemo(() => itemQuantity * price, [itemQuantity, price]);

  const handleDecrement = useCallback(() => {
    if (itemQuantity <= 1) {
      return;
    }

    onChange && onChange({ ...cartItem, currentQuantity: currentQuantity - 1 });
  }, [itemQuantity, cartItem]);

  const handleIncrement = useCallback(() => {
    onChange && onChange({ ...cartItem, currentQuantity: currentQuantity + 1 });
  }, [itemQuantity, cartItem]);

  const handleRemove = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { currentQuantity: cq, ...moreCartItem } = cartItem;
    onChange && onChange({ ...moreCartItem, quantity: 0 });
  }, [itemQuantity, cartItem]);

  return (
    <MotionSurface
      pos='relative'
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
      {!itemQuantity && (
        <Flex
          alignItems='center'
          justifyContent='center'
          pos='absolute'
          w='100%'
          h='100%'
          bgColor='rgba(0,0,0,0.5)'
        >
          <Spinner />
        </Flex>
      )}
      <Box mr={4} w='103px'>
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
            value={itemQuantity}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            disabled={!itemQuantity}
          />
        </HStack>
        <Flex alignItems='center'>
          <Box
            flexGrow={0}
            py={2}
            mr={4}
            minW='130px'
            textAlign='center'
            borderRadius='999px'
            overflow='hidden'
            bgColor={variables.accentColor}
          >
            <Text>{formatPrice(itemTotal)}</Text>
          </Box>
          <RemoveIconButton onClick={handleRemove} disabled={!itemQuantity} />
        </Flex>
      </Flex>
    </MotionSurface>
  );
};

CartItem.defaultProps = {
  onChange: undefined
};
