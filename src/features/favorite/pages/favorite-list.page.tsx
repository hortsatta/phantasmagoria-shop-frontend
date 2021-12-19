import { FC, useState } from 'react';
import { Flex } from '@chakra-ui/react';

import { CardProduct } from 'models';
import { PageBox } from 'features/core/components';
import { ShopList } from 'features/shop/components';
import { useGetFavoritesByFilters } from '../hooks';

export const FavoriteListPage: FC = () => {
  const { items, searchKeyword, loading, setSearchKeyword } = useGetFavoritesByFilters();
  const [currentItemDetail, setCurrentItemDetail] = useState<CardProduct | null>(null);

  return (
    <PageBox d='flex' alignItems='flex-start' justifyContent='center' pb={0} h='100%' flex={1}>
      <Flex pb='60px' w='8xl' minH='100vh' pos='relative' alignItems='flex-start'>
        <ShopList
          items={items}
          loading={loading}
          onDetailClick={(item: CardProduct) => setCurrentItemDetail(item)}
          // onEditClick={(item: CardProduct) => handleEditItem(item)}
        />
      </Flex>
    </PageBox>
  );
};
