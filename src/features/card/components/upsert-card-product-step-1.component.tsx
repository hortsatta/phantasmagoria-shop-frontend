import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/react';

import { appModulesVar } from 'config';
import { Card } from 'models';
import { GET_CARDS } from 'services/graphql';
import { PageContext } from 'features/core/contexts';
import { useDebounceValue } from 'features/core/hooks';
import { FormSectionHeading, Input, Surface } from 'features/core/components';
import { CardProductFormData } from './upsert-card-product-form.component';
import { CardDetail } from './card-detail.component';
import { CardList } from './card-list.component';

import variables from 'assets/styles/_variables.module.scss';

type CardModalProps = {
  onClose: () => void;
  isOpen: boolean;
  card: Card | null;
};

const LABEL_WIDTH = '117px';

const cardListStyle = {
  height: '400px',
  backgroundColor: variables.inputBgColor,
  borderRadius: '4px'
};

const CardModal: FC<CardModalProps> = ({ onClose, isOpen, card }) => (
  <Modal onClose={onClose} isOpen={isOpen} isCentered>
    <ModalOverlay />
    <ModalContent bg='rgba(0,0,0,0)' maxW='2xl'>
      <ModalCloseButton _focus={{ boxShadow: 0 }} />
      <ModalBody p={0}>
        <Surface p={6}>{card && <CardDetail id={card.id} />}</Surface>
      </ModalBody>
    </ModalContent>
  </Modal>
);

export const UpsertCardProductStep1: FC = () => {
  const { changePage } = useContext(PageContext);
  const appModules: any = useReactiveVar(appModulesVar);
  // Form controls
  const { control, watch } = useFormContext<CardProductFormData>();
  const selectedCards = watch('cards', []);
  // View card detail modal
  const { isOpen: modalIsOpen, onOpen: modalOnOpen, onClose: modalOnClose } = useDisclosure();
  const [currentCardDetail, setCurrentCardDetail] = useState<Card | null>(null);
  // Cards query search and parameters
  const [cards, { data, loading }] = useLazyQuery(GET_CARDS);
  const [keyword, setKeyword] = useState('');
  const { debouncedValue: debounceKeyword, loading: debounceLoading } = useDebounceValue(keyword);
  const cardVariables = useMemo(
    () => ({
      where: {
        name_contains: debounceKeyword.trim()
      }
    }),
    [debounceKeyword]
  );

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

    modalOnOpen();
    setCurrentCardDetail(card);
  };

  const handleCardModalClose = () => {
    modalOnClose();
    setCurrentCardDetail(null);
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
            <FormSectionHeading>Cards</FormSectionHeading>
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
            <FormSectionHeading>Selected Cards</FormSectionHeading>
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
      <CardModal onClose={handleCardModalClose} isOpen={modalIsOpen} card={currentCardDetail} />
    </>
  );
};
