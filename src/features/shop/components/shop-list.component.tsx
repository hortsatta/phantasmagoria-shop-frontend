import { FC, ReactNode } from 'react';
import { Center, Flex, Spinner, Text } from '@chakra-ui/react';

import { CardProduct } from 'models';
import { ShopItem } from './shop-item.component';

import variables from 'assets/styles/_variables.module.scss';

type Props = {
  items: CardProduct[];
  loading?: boolean;
  onCartClick?: (item: CardProduct) => void;
  onDetailClick?: (item: CardProduct) => void;
  onFavoriteClick?: (item: CardProduct) => void;
  onEditClick?: (item: CardProduct) => void;
};

type LoadingOverlayProps = {
  children?: ReactNode;
  loading?: boolean;
};

const LoadingOverlay: FC<LoadingOverlayProps> = ({ loading, children }) => (
  <>
    {loading && (
      <Center pos='absolute' top={0} left={0} w='100%' h='352px' bgColor='transparent' zIndex={1}>
        <Spinner size='xl' />
      </Center>
    )}
    {children}
  </>
);

export const ShopList: FC<Props> = ({
  items,
  loading,
  onCartClick,
  onDetailClick,
  onFavoriteClick,
  onEditClick
}) => (
  <Flex pos='relative' flexDir='column' w='100%'>
    <LoadingOverlay loading={loading}>
      <Flex
        flex={1}
        alignItems='flex-start'
        justifyContent='flex-start'
        flexWrap='wrap'
        w='100%'
        opacity={loading ? 0.5 : 1}
        transition='opacity 0.2s ease'
      >
        {items.map((item: CardProduct) => (
          <ShopItem
            key={item.id}
            item={item}
            {...(onCartClick && { onCartClick })}
            {...(onDetailClick && { onDetailClick })}
            {...(onFavoriteClick && { onFavoriteClick })}
            {...(onEditClick && { onEditClick })}
          />
        ))}
        {!items.length && !loading && (
          <Text
            mt={8}
            w='100%'
            textAlign='center'
            fontFamily={variables.primaryFont}
            fontSize='4xl'
          >
            we could only show nothing.
          </Text>
        )}
      </Flex>
    </LoadingOverlay>
  </Flex>
);

ShopList.defaultProps = {
  loading: false,
  onCartClick: undefined,
  onDetailClick: undefined,
  onFavoriteClick: undefined,
  onEditClick: undefined
};

LoadingOverlay.defaultProps = {
  children: undefined,
  loading: false
};
