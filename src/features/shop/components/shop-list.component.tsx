import { FC, useMemo } from 'react';
import { Flex, Text } from '@chakra-ui/react';

import { CardProduct } from 'models';
import { LoadingOverlay } from 'features/core/components';
import { ShopItem } from './shop-item.component';

import variables from 'assets/styles/_variables.module.scss';

type Props = {
  items: CardProduct[];
  loading?: boolean;
  processingItems?: any;
  onCartClick?: (item: CardProduct) => void;
  onDetailClick?: (item: CardProduct) => void;
  onFavoriteClick?: (item: CardProduct) => void;
  onEditClick?: (item: CardProduct) => void;
};

export const ShopList: FC<Props> = ({
  items,
  loading,
  processingItems,
  onCartClick,
  onDetailClick,
  onFavoriteClick,
  onEditClick
}) => {
  const isEmpty = useMemo(() => !items.length && !loading, [items, loading]);

  return (
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
              loading={processingItems[item.id]}
              {...(onCartClick && { onCartClick })}
              {...(onDetailClick && { onDetailClick })}
              {...(onFavoriteClick && { onFavoriteClick })}
              {...(onEditClick && { onEditClick })}
            />
          ))}
          {isEmpty && (
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
};

ShopList.defaultProps = {
  loading: false,
  processingItems: {},
  onCartClick: undefined,
  onDetailClick: undefined,
  onFavoriteClick: undefined,
  onEditClick: undefined
};
