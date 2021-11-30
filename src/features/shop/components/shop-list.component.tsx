import { FC } from 'react';
import { Flex } from '@chakra-ui/react';

import { CardProduct } from 'models';
import { ShopItem } from './shop-item.component';

type Props = {
  items: CardProduct[];
  loading?: boolean;
};

export const ShopList: FC<Props> = ({ items, loading }) => (
  <Flex flexDir='column'>
    <Flex flex={1} alignItems='flex-start' justifyContent='center' flexWrap='wrap'>
      {items.map((item: CardProduct) => (
        <ShopItem key={item.id} item={item} />
      ))}
    </Flex>
  </Flex>
);

ShopList.defaultProps = {
  loading: false
};
