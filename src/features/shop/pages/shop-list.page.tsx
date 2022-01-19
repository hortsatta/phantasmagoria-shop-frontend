import { CSSProperties, FC, useCallback, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import {
  Box,
  BoxProps,
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
import { CardProductRbacType, CardRbacType } from 'config/rbac';
import { CardProduct } from 'models';
import { PageContext } from 'features/core/contexts';
import { useGuard } from 'features/core/hooks';
import { useGetUser } from 'features/user/hooks';
import { useUpsertCart } from 'features/cart/hooks';
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

const resWidth = { '2xl': '320px', xl: '280px', base: '250px' };

const sideSectionWrapperProps: BoxProps = {
  position: 'fixed',
  flex: 1,
  width: resWidth,
  height: 'calc(100% - 60px)'
};

const scrollbarStyles: CSSProperties = {
  flex: 1,
  width: '100%',
  height: '100%'
};

const sideSectionProps: StackProps = {
  flexDir: 'column',
  p: 6,
  spacing: 4
};

const boxFillerProps: BoxProps = {
  flexShrink: 0,
  width: resWidth
};

export const ShopListPage: FC = () => {
  const { changePage } = useContext(PageContext);
  const { canActivate } = useGuard();
  const { userAccount } = useGetUser();
  const history = useHistory();
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
  } = useGetShopItemsByFilters();
  const { addCartItem } = useUpsertCart();
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

  const handleToggleFavorite = useCallback(
    (item: CardProduct) => {
      if (userAccount) {
        updateFavoriteItem(item);
      } else {
        const loginPath = `${appModules?.user.path}${appModules?.user.children?.signIn.path}`;
        changePage(appModules?.user.children?.signIn.key, loginPath);
      }
    },
    [appModules, userAccount]
  );

  return (
    <PageBox d='flex' alignItems='flex-start' justifyContent='center' pb={0} h='100%' flex={1}>
      <Box left={0} {...sideSectionWrapperProps}>
        <Scrollbars className='scrollbar' style={{ ...scrollbarStyles }} hideHorizontalScroll>
          <VStack {...sideSectionProps}>
            {canActivate([CardRbacType.CREATE, CardProductRbacType.CREATE]) && (
              <Box w='100%'>
                <Box pb={4}>
                  <Heading pb={2} fontSize='xl' as='h4'>
                    admin section
                  </Heading>
                  <Divider borderColor='rgba(255,255,255,0.12)' />
                </Box>
                <ShopAdminControl />
              </Box>
            )}
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
      </Box>
      <Flex
        pb='60px'
        w='100%'
        h='100%'
        minH='100vh'
        justifyContent='center'
        alignItems='flex-start'
      >
        <Box {...boxFillerProps} />
        <Flex w='100%' h='100%' maxW='7xl' pos='relative' alignItems='flex-start'>
          <Divider pos='absolute' h='100%' orientation='vertical' />
          <Flex flexDir='column' alignItems='flex-start' flex={1} p={8}>
            <Box mt={6} mb={12} mx='auto' w='xl'>
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
              onCartClick={(item: CardProduct) => addCartItem(item)}
              onDetailClick={(item: CardProduct) => setCurrentItemDetail(item)}
              onFavoriteClick={(item: CardProduct) => handleToggleFavorite(item)}
              onEditClick={(item: CardProduct) => handleEditItem(item)}
            />
          </Flex>
          <Divider pos='absolute' right='0px' h='100%' orientation='vertical' />
        </Flex>
        <Box {...boxFillerProps} />
      </Flex>
      <Box right={0} {...sideSectionWrapperProps}>
        <Scrollbars className='scrollbar' style={{ ...scrollbarStyles }} hideHorizontalScroll>
          <Flex {...sideSectionProps} pt={2}>
            <AnimatePresence>
              {currentItemDetail && (
                <ShopItemDetail
                  id={currentItemDetail.id}
                  initial={{ opacity: 0, transform: 'translateX(-32px)' }}
                  animate={{ opacity: 1, transform: 'translateX(0px)' }}
                  exit={{ opacity: 0, transform: 'translateX(32px)' }}
                  transition={{ type: 'tween', duration: 0.2 }}
                  onClose={() => setCurrentItemDetail(null)}
                  onFavoriteClick={(item: CardProduct) => handleToggleFavorite(item)}
                />
              )}
            </AnimatePresence>
          </Flex>
        </Scrollbars>
      </Box>
    </PageBox>
  );
};
