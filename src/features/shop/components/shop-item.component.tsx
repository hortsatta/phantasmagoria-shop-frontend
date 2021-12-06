import { FC, useMemo } from 'react';
import { Box, Button, Divider, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { Brain, Knife, Tray } from 'phosphor-react';

import { CardProduct } from 'models';
import { Icon, IconButton, MotionSurface } from 'features/core/components';

import variables from 'assets/styles/_variables.module.scss';

type Props = {
  item: CardProduct;
  onCartClick?: (item: CardProduct) => void;
  onDetailClick?: (item: CardProduct) => void;
  onFavoriteClick?: (item: CardProduct) => void;
};

export const ShopItem: FC<Props> = ({ item, onCartClick, onDetailClick, onFavoriteClick }) => {
  const { name, price, image, cards } = item;
  const itemImage = useMemo(() => image?.url || cards[0].coverImage.url, [item]);

  return (
    <MotionSurface
      flexDir='column'
      justifyContent='center'
      alignItems='center'
      m={4}
      w='272px'
      borderColor='rgba(255,255,255,0.06)'
      borderWidth='1px'
      borderRadius={8}
      overflow='hidden'
      initial={{ opacity: 0, transform: 'translateY(32px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      layout
    >
      <Box pos='relative' w='100%' h='212px' overflow='hidden'>
        <Text
          pos='absolute'
          top={0}
          left={0}
          py='2px'
          mt='8px'
          ml='8px'
          w='70px'
          bgColor={variables.accentColor}
          fontSize='sm'
          textAlign='center'
          borderRadius='999px'
          overflow='hidden'
        >
          {price && `\u20B1${price}`}
        </Text>
        <Image src={itemImage} bgColor='rgba(0,0,0,0.3)' objectFit='contain' />
      </Box>
      <Flex w='100%' flexDir='column' alignItems='center'>
        <Divider />
        <Button
          variant='link'
          _hover={{ color: variables.primaryColor }}
          _focus={{ boxShadow: 'none' }}
          w='100%'
          color={variables.textColor}
          {...(onDetailClick && { onClick: () => onDetailClick(item) })}
        >
          <Heading as='h4' py={2} fontSize={20} textAlign='center'>
            {name}
          </Heading>
        </Button>
        <Divider w='90%' />
        <Flex
          pos='relative'
          justifyContent='space-around'
          alignItems='flex-start'
          w='100%'
          h='64px'
        >
          <IconButton
            aria-label='Add to cart'
            flex={1}
            pos='relative'
            h='100%'
            zIndex={2}
            icon={<Icon w={6} boxSizing='content-box' as={Tray} />}
            {...(onCartClick && { onClick: () => onCartClick(item) })}
          />
          <Divider h='90%' orientation='vertical' />
          <IconButton
            aria-label='View item detail'
            flex={1}
            pos='relative'
            h='100%'
            zIndex={2}
            icon={<Icon w={6} boxSizing='content-box' as={Brain} />}
            {...(onDetailClick && { onClick: () => onDetailClick(item) })}
          />
          <Divider h='90%' orientation='vertical' />
          <IconButton
            aria-label='Add to favorites'
            flex={1}
            pos='relative'
            h='100%'
            zIndex={2}
            icon={<Icon w={6} boxSizing='content-box' as={Knife} />}
            {...(onFavoriteClick && { onClick: () => onFavoriteClick(item) })}
          />
        </Flex>
      </Flex>
    </MotionSurface>
  );
};

ShopItem.defaultProps = {
  onCartClick: undefined,
  onDetailClick: undefined,
  onFavoriteClick: undefined
};
