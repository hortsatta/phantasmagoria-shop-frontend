import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import {
  Box,
  Divider,
  Flex,
  InputRightElement,
  StackDivider,
  StackProps,
  VStack
} from '@chakra-ui/react';
import { X as XSvg } from 'phosphor-react';
import { AnimatePresence } from 'framer-motion';

import { CardProduct } from 'models';
import { GET_CARD_PRODUCTS } from 'services/graphql';
import { useDebounceValue } from 'features/core/hooks';
import {
  Icon,
  IconButton,
  PageBox,
  Scrollbars,
  SearchInput,
  SubHeading
} from 'features/core/components';
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
  height: '100%'
};

const sideSectionStyles: StackProps = {
  flexDir: 'column',
  p: 6,
  spacing: 4,
  divider: <StackDivider borderColor='rgba(255,255,255,0.06)' />
};

export const ShopListPage: FC = () => {
  // Card products query search with product or card name as keyword
  const [getCardProducts, { data: { cardProducts = [] } = {}, loading }] =
    useLazyQuery(GET_CARD_PRODUCTS);
  const [currentItemDetail, setCurrentItemDetail] = useState<CardProduct | null>(null);
  const [itemFilters, setItemFilters] = useState<any>(null);
  const [itemSort, setItemSort] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const { debouncedValue: debounceSearchKeyword, loading: debounceSearchLoading } =
    useDebounceValue(searchKeyword);

  const itemVariables = useMemo(() => {
    const { rarities, categories, types } = itemFilters || {};

    const cards = {
      ...(!!rarities?.length && { rarity: { id_in: rarities } }),
      ...(!!categories?.length && { category: { id_in: categories } }),
      ...(!!types?.length && { types: { id_in: types } })
    };

    return {
      ...(itemSort && { sort: itemSort }),
      where: {
        _or: [
          {
            name_contains: debounceSearchKeyword.trim(),
            cards
          },
          {
            cards: {
              ...cards,
              name_contains: debounceSearchKeyword.trim()
            }
          }
        ]
      }
    };
  }, [debounceSearchKeyword, itemFilters, itemSort]);

  useEffect(() => {
    getCardProducts({ variables: itemVariables });
  }, [itemVariables]);

  const handleSearchChange = (e: any) => {
    const { value } = e.target;
    setSearchKeyword(value);
  };

  return (
    <PageBox d='flex' alignItems='flex-start' justifyContent='center' pb={0} h='100%' flex={1}>
      <Scrollbars
        className='scrollbar'
        style={{ ...scrollbarStyles, left: 0 }}
        hideHorizontalScroll
      >
        <VStack {...sideSectionStyles}>
          <Box w='100%'>
            <SubHeading pb={4} fontSize='3xl'>
              admin section
            </SubHeading>
            <ShopAdminControl />
          </Box>
          <Box w='100%'>
            <SubHeading pb={4} fontSize='3xl'>
              sort cards
            </SubHeading>
            <ShopItemSorter value={itemSort} onChange={setItemSort} />
          </Box>
          <Box w='100%'>
            <SubHeading pb={4} fontSize='3xl'>
              filter cards
            </SubHeading>
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
            items={cardProducts}
            loading={loading || debounceSearchLoading}
            onDetailClick={(item: CardProduct) => setCurrentItemDetail(item)}
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
              />
            )}
          </AnimatePresence>
        </Flex>
      </Scrollbars>
    </PageBox>
  );
};
