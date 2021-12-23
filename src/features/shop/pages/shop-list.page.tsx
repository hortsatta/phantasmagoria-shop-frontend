import { CSSProperties, FC, useCallback, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import {
  Box,
  Divider,
  Flex,
  Heading,
  InputRightElement,
  StackProps,
  VStack
} from '@chakra-ui/react';
import { X as XSvg } from 'phosphor-react';
import { AnimatePresence } from 'framer-motion';

import { appModulesVar } from 'config';
import { CardProduct } from 'models';
import { useUpsertFavoriteCache } from 'features/favorite/hooks';
import { Icon, IconButton, PageBox, Scrollbars, SearchInput } from 'features/core/components';
import { useGetShopItemsByFilters } from '../hooks';
import {
  ShopAdminControl,
  ShopItemDetail,
  ShopItemFilters,
  ShopItemSorter,
  ShopList
} from '../components';

const scrollbarStyles: CSSProperties = {
  position: 'fixed',
  flex: 1,
  width: '320px',
  height: 'calc(100% - 60px)'
};

const sideSectionStyles: StackProps = {
  flexDir: 'column',
  p: 6,
  spacing: 4
};

export const ShopListPage: FC = () => {
  const history = useHistory();
  const { state: locState } = useLocation();
  const appModules: any = useReactiveVar(appModulesVar);
  const {
    items,
    searchKeyword,
    itemSort,
    itemFilters,
    loading,
    setSearchKeyword,
    setItemSort,
    setItemFilters
  } = useGetShopItemsByFilters(locState);
  const { updateFavoriteItem } = useUpsertFavoriteCache();
  const [currentItemDetail, setCurrentItemDetail] = useState<CardProduct | null>(null);

  const handleSearchChange = useCallback((e: any) => {
    const { value } = e.target;
    setSearchKeyword(value);
  }, []);

  const handleEditItem = useCallback(
    (item: CardProduct) => {
      const editPath = `${appModules.admin.path}${appModules.shop.path}/${item.slug}${appModules.shop.children?.edit.path}`;
      history.push(editPath);
    },
    [appModules]
  );

  return (
    <PageBox d='flex' alignItems='flex-start' justifyContent='center' pb={0} h='100%' flex={1}>
      <Scrollbars
        className='scrollbar'
        style={{ ...scrollbarStyles, left: 0 }}
        hideHorizontalScroll
      >
        <VStack {...sideSectionStyles}>
          <Box w='100%'>
            <Box pb={4}>
              <Heading pb={2} fontSize='xl' as='h4'>
                admin section
              </Heading>
              <Divider borderColor='rgba(255,255,255,0.12)' />
            </Box>
            <ShopAdminControl />
          </Box>
          <Box w='100%'>
            <Box py={4}>
              <Heading pb={2} fontSize='xl' as='h4'>
                sort cards
              </Heading>
              <Divider borderColor='rgba(255,255,255,0.12)' />
            </Box>
            <ShopItemSorter value={itemSort} onChange={setItemSort} />
          </Box>
          <Box w='100%'>
            <Box py={4}>
              <Heading pb={2} fontSize='xl' as='h4'>
                filter cards
              </Heading>
              <Divider borderColor='rgba(255,255,255,0.12)' />
            </Box>
            <ShopItemFilters
              value={itemFilters}
              onChange={(filters: any) => setItemFilters(filters)}
            />
          </Box>
        </VStack>
      </Scrollbars>
      <Flex pb='60px' w='7xl' minH='100vh' pos='relative' alignItems='flex-start'>
        <Divider pos='absolute' h='100%' orientation='vertical' />
        <Flex flexDir='column' alignItems='flex-start' flex={1} p={8}>
          <Box mt={6} mb={12} mx='auto' w='xl'>
            <SearchInput
              value={searchKeyword}
              onChange={handleSearchChange}
              {...(searchKeyword && {
                rightComponent: (
                  <InputRightElement>
                    <IconButton
                      pr={2}
                      cursor='pointer'
                      aria-label='clear search'
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
            onDetailClick={(item: CardProduct) => setCurrentItemDetail(item)}
            onEditClick={(item: CardProduct) => handleEditItem(item)}
            onFavoriteClick={(item: CardProduct) => updateFavoriteItem(item)}
          />
        </Flex>
        <Divider pos='absolute' right='0px' h='100%' orientation='vertical' />
      </Flex>
      <Scrollbars
        className='scrollbar'
        style={{ ...scrollbarStyles, right: 0 }}
        hideHorizontalScroll
      >
        <Flex {...sideSectionStyles} pt={2}>
          <AnimatePresence>
            {currentItemDetail && (
              <ShopItemDetail
                id={currentItemDetail.id}
                initial={{ opacity: 0, transform: 'translateX(-32px)' }}
                animate={{ opacity: 1, transform: 'translateX(0px)' }}
                exit={{ opacity: 0, transform: 'translateX(32px)' }}
                transition={{ type: 'tween', duration: 0.2 }}
                onClose={() => setCurrentItemDetail(null)}
                onFavoriteClick={(item: CardProduct) => updateFavoriteItem(item)}
              />
            )}
          </AnimatePresence>
        </Flex>
      </Scrollbars>
    </PageBox>
  );
};
