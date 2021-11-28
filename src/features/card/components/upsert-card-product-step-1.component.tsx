import { FC, ComponentProps, useContext, useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, Button, HStack, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { Funnel } from 'phosphor-react';

import { appModulesVar } from 'config';
import { Card } from 'models';
import { GET_CARDS } from 'services/graphql';
import { PageContext } from 'features/core/contexts';
import { useDebounceValue } from 'features/core/hooks';
import {
  FormSectionHeading,
  Icon,
  IconButton,
  Input,
  Modal,
  Surface
} from 'features/core/components';
import { CardProductFormData } from './upsert-card-product-form.component';
import { CardDetail } from './card-detail.component';
import { CardFilters } from './card-filters.component';
import { CardList } from './card-list.component';

import variables from 'assets/styles/_variables.module.scss';

type ModalProps = Omit<ComponentProps<typeof Modal>, 'children'>;

type CardModalProps = ModalProps & {
  card: Card | null;
};

type FilterModalProps = ModalProps & {
  filters: any;
  loading: boolean;
  onFiltersChange: any;
};

const LABEL_WIDTH = '117px';

const cardListStyle = {
  height: '400px',
  backgroundColor: variables.inputBgColor,
  borderRadius: '4px'
};

const CardModal: FC<CardModalProps> = ({ card, isOpen, onClose }) => (
  <Modal onClose={onClose} isOpen={isOpen} modalContentProps={{ maxW: '2xl' }} isCentered>
    <Surface p={6}>{card && <CardDetail id={card.id} />}</Surface>
  </Modal>
);

const FilterModal: FC<FilterModalProps> = ({
  filters,
  isOpen,
  loading,
  onClose,
  onFiltersChange
}) => (
  <Modal onClose={onClose} isOpen={isOpen} modalContentProps={{ maxW: '2xl' }} isCentered>
    <Surface p={6}>
      <CardFilters value={filters} loading={loading} onChange={onFiltersChange} />
    </Surface>
  </Modal>
);

export const UpsertCardProductStep1: FC = () => {
  const { changePage } = useContext(PageContext);
  const appModules: any = useReactiveVar(appModulesVar);
  // Form controls
  const { control, watch } = useFormContext<CardProductFormData>();
  const selectedCards = watch('cards', []);
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
  const [cardFilters, setCardFilters] = useState<any>({
    rarities: [],
    categories: [],
    types: []
  });
  // Cards query search and parameters
  const [cards, { data, loading }] = useLazyQuery(GET_CARDS);
  const [keyword, setKeyword] = useState('');
  const { debouncedValue: debounceKeyword, loading: debounceLoading } = useDebounceValue(keyword);
  const cardVariables = useMemo(() => {
    const { rarities, categories, types } = cardFilters;

    return {
      where: {
        name_contains: debounceKeyword.trim(),
        ...(rarities.length && { rarity: { id_in: rarities } }),
        ...(categories.length && { category: { id_in: categories } }),
        ...(types.length && { types: { id_in: types } })
      }
    };
  }, [debounceKeyword, cardFilters]);
  // Filter card results from api
  const filteredCards = useMemo(
    () => data?.cards.filter((c1: Card) => !selectedCards.some(c2 => c2.id === c1.id)) || [],
    [data, selectedCards]
  );

  useEffect(() => {
    cards({ variables: cardVariables });
  }, [cardVariables]);

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
          inputLeftAddonProps={{ w: LABEL_WIDTH }}
          leftComponent='Find Card'
          onChange={(e: any) => setKeyword(e.target.value)}
        />
        <HStack flex={1} alignItems='flex-start' spacing={4}>
          <Box flex={1}>
            <FormSectionHeading
              rightComponent={
                <IconButton
                  aria-label='View Card Detail'
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
                  loading={loading || debounceLoading}
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
                    loading={loading || debounceLoading}
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
      <CardModal onClose={handleCardModalClose} isOpen={cardModalIsOpen} card={currentCardDetail} />
      <FilterModal
        onClose={filterModalOnClose}
        isOpen={filterModalIsOpen}
        filters={cardFilters}
        loading={loading || debounceLoading}
        onFiltersChange={handleCardFiltersChange}
      />
    </>
  );
};
