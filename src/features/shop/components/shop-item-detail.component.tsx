import { ComponentProps, FC } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import {
  Box,
  BoxProps,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Image,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react';
import { Tray, X as XSvg } from 'phosphor-react';
import { motion } from 'framer-motion';

import { currentUserAccountVar } from 'config';
import { Card, CardProduct } from 'models';
import { GET_CARD_PRODUCTS_DETAIL } from 'services/graphql';
import { Icon, IconButton } from 'features/core/components';
import { AddToCartButton } from 'features/cart/components';
import { FavoriteButton } from 'features/favorite/components';

import variables from 'assets/styles/_variables.module.scss';

const MotioBox = motion<BoxProps>(Box);

const iconButtonProps = {
  w: '100%',
  h: '100%',
  wrapperProps: { w: '50px', h: '50px', zIndex: 2 }
};

type Props = Omit<ComponentProps<typeof MotioBox>, 'transition'> & {
  id: string;
  transition?: any;
  onClose?: () => void;
  onCartClick?: (item: CardProduct) => void;
  onFavoriteClick?: (item: CardProduct) => void;
};

export const ShopItemDetail: FC<Props> = ({
  id,
  onClose,
  onCartClick,
  onFavoriteClick,
  ...moreProps
}) => {
  const userAccount = useReactiveVar(currentUserAccountVar);
  const { data: { cardProducts = [] } = {}, loading } = useQuery(GET_CARD_PRODUCTS_DETAIL, {
    variables: { userAccountId: userAccount?.id || '', where: { id } }
  });
  const { name, description, price, cards, favorites } = cardProducts[0] || {};
  const isCardsMultiple = (cards?.length || 0) > 1;

  return (
    <MotioBox {...moreProps}>
      {loading && (
        <Center pos='absolute' top={0} left={0} w='100%' minH='50vh' zIndex={1}>
          <Spinner size='xl' />
        </Center>
      )}
      {!!cardProducts?.length && (
        <>
          <IconButton
            mb={1}
            w='100%'
            zIndex={2}
            aria-label='close detail'
            icon={<Icon w={6} boxSizing='content-box' as={XSvg} />}
            {...(onClose && { onClick: onClose })}
          />
          <VStack spacing={2}>
            <Flex w='100%' alignItems='center' justifyContent='space-between'>
              <Text
                py='2px'
                w='80px'
                bgColor={variables.accentColor}
                textAlign='center'
                fontSize='md'
                borderRadius='999px'
                overflow='hidden'
              >
                {price && `\u20B1${price}`}
              </Text>
              <HStack spacing={0}>
                <AddToCartButton
                  aria-label='add to cart'
                  icon={<Icon w={6} boxSizing='content-box' as={Tray} />}
                  {...iconButtonProps}
                  {...(onCartClick && { onClick: () => onCartClick(cardProducts[0]) })}
                />
                <FavoriteButton
                  aria-label='add to favorites'
                  isActive={!!favorites?.length}
                  {...iconButtonProps}
                  {...(onFavoriteClick && { onClick: () => onFavoriteClick(cardProducts[0]) })}
                />
              </HStack>
            </Flex>
            <Divider width='90%' />
            <Heading fontSize='3xl' as='h4'>
              {name}
            </Heading>
            <Divider width='90%' />
            {isCardsMultiple && (
              <>
                <Text pb={2} textAlign='justify'>
                  {description}
                </Text>
                <Divider width='90%' />
              </>
            )}
            {!!cards?.length && (
              <VStack pt={2} spacing={4}>
                {cards.map((card: Card) => (
                  <Box
                    key={card.id}
                    w='100%'
                    bgColor={variables.surfaceColor}
                    borderColor='rgba(255,255,255,0.12)'
                    borderWidth='1px'
                    borderRadius='8px'
                    overflow='hidden'
                  >
                    <Image src={card.image?.url} alt={card.name} objectFit='cover' />
                  </Box>
                ))}
              </VStack>
            )}
          </VStack>
        </>
      )}
    </MotioBox>
  );
};

ShopItemDetail.defaultProps = {
  transition: undefined,
  onClose: undefined,
  onCartClick: undefined,
  onFavoriteClick: undefined
};
