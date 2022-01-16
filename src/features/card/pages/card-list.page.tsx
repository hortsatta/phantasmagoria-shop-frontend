import { FC, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import {
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  InputRightElement,
  StackDivider,
  Text,
  TextProps,
  VStack,
  useDisclosure
} from '@chakra-ui/react';
import { Funnel, PlusCircle, X as XSvg } from 'phosphor-react';

import { Card } from 'models';
import { appModulesVar, cardCategoriesVar, cardRaritiesVar, cardTypesVar } from 'config';
import { Icon, IconButton, Input, PageBox, Surface } from 'features/core/components';
import { useGetCardsByFilters } from '../hooks';
import { CardDetailModal, CardFiltersModal, CardList } from '../components';

import variables from 'assets/styles/_variables.module.scss';

type CurrentFiltersProps = {
  filters: any;
  onFilterClick: any;
};

const filterTextProps: TextProps = {
  px: 2,
  as: 'small'
};

const CurrentFilters: FC<CurrentFiltersProps> = ({ filters, onFilterClick }) => {
  const cardRarities = useReactiveVar(cardRaritiesVar);
  const cardCategories = useReactiveVar(cardCategoriesVar);
  const cardTypes = useReactiveVar(cardTypesVar);
  const { rarities, categories, types } = filters || {};

  const currentRarities = useMemo(
    () =>
      rarities
        ?.map(
          (id: number) => cardRarities?.find(rarity => rarity.id === id.toString())?.name || null
        )
        .join(', '),
    [rarities]
  );

  const currentCategories = useMemo(
    () =>
      categories
        ?.map((id: number) => cardCategories?.find(cat => cat.id === id.toString())?.name || null)
        .join(', '),
    [categories]
  );

  const currentTypes = useMemo(
    () =>
      types
        ?.map((id: number) => cardTypes?.find(type => type.id === id.toString())?.name || null)
        .join(', '),
    [types]
  );

  return (
    <HStack h='100%' divider={<StackDivider alignSelf='center' h='80%' opacity={0.6} />}>
      {currentRarities && <Text {...filterTextProps}>{currentRarities}</Text>}
      {currentCategories && <Text {...filterTextProps}>{currentCategories}</Text>}
      {currentTypes && <Text {...filterTextProps}>{currentTypes}</Text>}
      {!currentRarities && !currentCategories && !currentTypes && (
        <Text {...filterTextProps}>No filters</Text>
      )}
      <IconButton
        aria-label='view card filters'
        pos='relative'
        icon={<Icon w={7} boxSizing='content-box' as={Funnel} />}
        onClick={onFilterClick}
      />
    </HStack>
  );
};

export const CardListPage: FC = () => {
  const history = useHistory();
  const { state: locState } = useLocation();
  const appModules: any = useReactiveVar(appModulesVar);
  const { cards, searchKeyword, cardFilters, loading, setSearchKeyword, setCardFilters } =
    useGetCardsByFilters(locState);
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
  const addCardPath = useMemo(
    () => `${appModules.admin.path}${appModules.card.path}${appModules.card.children?.add.path}`,
    [appModules]
  );

  const handleCardDetailClick = (card?: Card) => {
    if (!card) {
      return;
    }
    cardModalOnOpen();
    setCurrentCardDetail(card);
  };

  const handleCardEditClick = (card?: Card) => {
    if (!card) {
      return;
    }
    const editPath = `${appModules.admin.path}${appModules.card.path}/${card.slug}${appModules.card.children?.edit.path}`;
    history.push(editPath);
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
      <PageBox pt={8} pageTitle='Cards' pageDescription='Card list'>
        <Center mb={6}>
          <Heading as='h2' fontSize='4xl'>
            Cards
          </Heading>
        </Center>
        <Surface m='0 auto' p={12} maxW='4xl' w='100%' h='2xl'>
          <VStack flex={1} spacing={6}>
            <Flex px={2} w='100%' justifyContent='space-between' alignItems='center'>
              <CurrentFilters filters={cardFilters} onFilterClick={filterModalOnOpen} />
              <Button
                variant='ghost'
                size='sm'
                leftIcon={<Icon w={7} as={PlusCircle} />}
                onClick={() => history.push(addCardPath)}
              >
                New Card
              </Button>
            </Flex>
            <Input
              value={searchKeyword}
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
            <CardList
              style={{ backgroundColor: variables.inputBgColor, borderRadius: '4px' }}
              cards={cards}
              loading={loading}
              onCardDetailClick={handleCardDetailClick}
              onCardEditClick={handleCardEditClick}
            />
          </VStack>
        </Surface>
      </PageBox>
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
