import { FC, useCallback, useState } from 'react';
import { Box, Center, Divider, Flex, Heading, InputRightElement } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { X as XSvg } from 'phosphor-react';

import { CardProduct } from 'models';
import { Icon, IconButton, PageBox, Scrollbars, SearchInput } from 'features/core/components';
import { ShopItemDetail, ShopList } from 'features/shop/components';
import { useGetFavoritesByFilters, useUpsertFavoriteCache } from '../hooks';

export const FavoriteListPage: FC = () => {
  const { items, searchKeyword, loading, setSearchKeyword } = useGetFavoritesByFilters();
  const { updateFavoriteItem, processingFavItems } = useUpsertFavoriteCache(true);
  const [currentItemDetail, setCurrentItemDetail] = useState<CardProduct | null>(null);

  const handleSearchChange = useCallback((e: any) => {
    const { value } = e.target;
    setSearchKeyword(value);
  }, []);

  return (
    <PageBox
      d='flex'
      alignItems='flex-start'
      justifyContent='center'
      pb={0}
      h='100%'
      flex={1}
      pageTitle='Favorites'
      pageDescription='My favorites'
    >
      <Flex
        pt={8}
        flexDir='column'
        pb='60px'
        w='100%'
        maxW='7xl'
        minH='100vh'
        pos='relative'
        justifyContent='flex-start'
      >
        <Center mb={6}>
          <Heading as='h2' fontSize='4xl'>
            My Favorites
          </Heading>
        </Center>
        <Box mt={2} mb={12} mx='auto' w='xl'>
          <SearchInput
            value={searchKeyword}
            onChange={handleSearchChange}
            {...(searchKeyword && {
              rightComponent: (
                <InputRightElement h='100%'>
                  <IconButton
                    alignItems='center'
                    justifyContent='center'
                    pr={2}
                    d='flex'
                    h='100%'
                    borderRadius={0}
                    cursor='pointer'
                    aria-label='clear search'
                    tooltip='clear search'
                    icon={<Icon as={XSvg} w={4} />}
                    onClick={() => setSearchKeyword('')}
                  />
                </InputRightElement>
              )
            })}
          />
        </Box>
        <ShopList
          items={items}
          loading={loading}
          processingItems={processingFavItems}
          onDetailClick={(item: CardProduct) => setCurrentItemDetail(item)}
          onFavoriteClick={(item: CardProduct) => updateFavoriteItem(item)}
        />
      </Flex>
      <Scrollbars
        className='scrollbar'
        style={{
          flex: 1,
          position: 'fixed',
          right: 0,
          width: '320px',
          height: 'calc(100% - 60px)'
        }}
        hideHorizontalScroll
      >
        <Box>
          <AnimatePresence>
            {currentItemDetail && (
              <>
                <Divider pos='absolute' h='100%' orientation='vertical' />
                <Flex flexDir='column' p={6} spacing={4} pt={2}>
                  <ShopItemDetail
                    id={currentItemDetail.id}
                    initial={{ opacity: 0, transform: 'translateX(-32px)' }}
                    animate={{ opacity: 1, transform: 'translateX(0px)' }}
                    exit={{ opacity: 0, transform: 'translateX(32px)' }}
                    transition={{ type: 'tween', duration: 0.2 }}
                    onClose={() => setCurrentItemDetail(null)}
                  />
                </Flex>
              </>
            )}
          </AnimatePresence>
        </Box>
      </Scrollbars>
    </PageBox>
  );
};
