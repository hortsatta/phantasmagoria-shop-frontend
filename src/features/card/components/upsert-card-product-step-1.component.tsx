import { FC, useContext, useMemo, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Box,
  Button,
  HStack,
  InputRightElement,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { Funnel, X as XSvg } from 'phosphor-react';

import { appModulesVar } from 'config';
import { Card } from 'models';
import { PageContext } from 'features/core/contexts';
import { FormSectionHeading, Icon, IconButton, Input } from 'features/core/components';
import { useGetCardsByFilters } from '../hooks';
import { CardProductFormData } from './upsert-card-product-form.component';
import { CardList } from './card-list.component';
import { CardDetailModal } from './card-detail-modal.component';
import { CardFiltersModal } from './card-filters-modal.component';

import variables from 'assets/styles/_variables.module.scss';

const LABEL_WIDTH = '117px';

const cardListStyle = {
  height: '400px',
  backgroundColor: variables.inputBgColor,
  borderRadius: '4px'
};

export const UpsertCardProductStep1: FC = () => {
  const { changePage } = useContext(PageContext);
  const appModules: any = useReactiveVar(appModulesVar);
  // Form controls
  const { control, watch } = useFormContext<CardProductFormData>();
  const selectedCards = watch('cards', []);
  // Query cards with filter
  const { cards, searchKeyword, cardFilters, loading, setSearchKeyword, setCardFilters } =
    useGetCardsByFilters();
  // View card detail modal
  const {
    isOpen: cardModalIsOpen,
    onOpen: cardModalOnOpen,
    onClose: cardModalOnClose
  } = useDisclosure();
  // View card filter modal
  const {
    isOpen: filterModalIsOpen,
    onOpen: filterModalOnOpen,
    onClose: filterModalOnClose
  } = useDisclosure();
  const [currentCardDetail, setCurrentCardDetail] = useState<Card | null>(null);
  // Filter card results from api
  const filteredCards = useMemo(
    () => cards.filter((c1: Card) => !selectedCards.some(c2 => c2.id === c1.id)) || [],
    [cards, selectedCards]
  );

  const handleNavigateToAddCard = () => {
    const addCardNav = appModules.card.children?.add;
    changePage(addCardNav?.key, `${appModules.card.path}${addCardNav?.path}`);
  };

  const handleCardDetailClick = (card?: Card) => {
    if (!card) {
      return;
    }
    cardModalOnOpen();
    setCurrentCardDetail(card);
  };

  const handleCardModalClose = () => {
    cardModalOnClose();
    setCurrentCardDetail(null);
  };

  const handleCardFiltersChange = (filters: any) => {
    filterModalOnClose();
    setCardFilters(filters);
  };

  return (
    <>
      <Stack flex={1} spacing={4}>
        <Input
          value={searchKeyword}
          inputLeftAddonProps={{ w: LABEL_WIDTH }}
          leftComponent='Find Card'
          onChange={(e: any) => setSearchKeyword(e.target.value)}
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
        <HStack flex={1} alignItems='flex-start' spacing={4}>
          <Box flex={1}>
            <FormSectionHeading
              rightComponent={
                <IconButton
                  aria-label='View Card Filters'
                  pos='relative'
                  icon={<Icon w={6} boxSizing='content-box' as={Funnel} />}
                  onClick={filterModalOnOpen}
                />
              }
            >
              Cards
            </FormSectionHeading>
            <Controller
              name='cards'
              control={control}
              render={({ field: { onChange } }) => (
                <CardList
                  style={cardListStyle}
                  cards={filteredCards}
                  loading={loading}
                  onCardClick={card => card && onChange([...selectedCards, card])}
                  onCardDetailClick={handleCardDetailClick}
                />
              )}
            />
          </Box>
          <Box flex={1}>
            <FormSectionHeading flexProps={{ h: '40px' }}>Selected Cards</FormSectionHeading>
            <Controller
              name='cards'
              control={control}
              render={({ field: { onChange }, formState: { errors } }) => (
                <Box flex={1} {...(errors.cards && { boxShadow: '0px 0px 3px red' })}>
                  <CardList
                    style={cardListStyle}
                    cards={selectedCards}
                    loading={loading}
                    onCardClick={card =>
                      card && onChange(selectedCards.filter(c => c.id !== card.id))
                    }
                    onCardDetailClick={handleCardDetailClick}
                  />
                </Box>
              )}
            />
          </Box>
        </HStack>
        <Text textAlign='center' as='small'>
          Card is missing?{' '}
          <Button
            color={variables.primaryColor}
            fontSize={14}
            textTransform='initial'
            variant='link'
            onClick={handleNavigateToAddCard}
          >
            Add new card
          </Button>
        </Text>
      </Stack>
      <CardDetailModal
        onClose={handleCardModalClose}
        isOpen={cardModalIsOpen}
        card={currentCardDetail}
      />
      <CardFiltersModal
        onClose={filterModalOnClose}
        isOpen={filterModalIsOpen}
        filters={cardFilters}
        loading={loading}
        onFiltersChange={handleCardFiltersChange}
      />
    </>
  );
};
