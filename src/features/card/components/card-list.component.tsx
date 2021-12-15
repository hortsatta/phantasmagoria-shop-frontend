import { ComponentProps, FC } from 'react';
import {
  Box,
  BoxProps,
  Center,
  Divider,
  Flex,
  HStack,
  Spinner,
  StackDivider,
  VStack
} from '@chakra-ui/react';
import { Brain, PenNib } from 'phosphor-react';

import { Card } from 'models';
import { Icon, IconButton, Scrollbars } from 'features/core/components';
import { MiniCardItem } from './mini-card-item.component';

import variables from 'assets/styles/_variables.module.scss';

type Props = ComponentProps<typeof Scrollbars> & {
  cards: Card[];
  loading?: boolean;
  wrapperProps?: BoxProps;
  onCardClick?: (card?: Card) => void;
  onCardDetailClick?: (card?: Card) => void;
  onCardEditClick?: (card?: Card) => void;
};

type CardControlProps = {
  onDetailClick: (e: any) => void;
  onEditClick?: (e: any) => void;
};

const CardControl: FC<CardControlProps> = ({ onDetailClick, onEditClick }) => (
  <Flex h='100%' alignItems='center'>
    <Divider h='80%' alignSelf='center' orientation='vertical' />
    <HStack
      h='100%'
      spacing={0}
      divider={<StackDivider h='80%' alignSelf='center' opacity={0.3} orientation='vertical' />}
    >
      <IconButton
        aria-label='View Card Detail'
        flex={1}
        h='100%'
        icon={<Icon px={4} w={6} boxSizing='content-box' as={Brain} />}
        onClick={onDetailClick}
      />
      {onEditClick && (
        <IconButton
          aria-label='Edit Card'
          flex={1}
          h='100%'
          icon={<Icon px={4} w={6} boxSizing='content-box' as={PenNib} />}
          onClick={onEditClick}
        />
      )}
    </HStack>
  </Flex>
);

export const CardList: FC<Props> = ({
  cards,
  loading,
  wrapperProps,
  onCardClick,
  onCardDetailClick,
  onCardEditClick,
  ...moreProps
}) => {
  const handleCardDetailClick = (e: any, card: Card) => {
    e.stopPropagation();
    onCardDetailClick && onCardDetailClick(card);
  };

  const handleCardEditClick = (e: any, card: Card) => {
    e.stopPropagation();
    onCardEditClick && onCardEditClick(card);
  };

  return (
    <Scrollbars className='scrollbar' hideHorizontalScroll {...moreProps}>
      <Box p={4} {...wrapperProps}>
        <Box overflow='hidden'>
          {loading && (
            <Center
              pos='absolute'
              top={0}
              left={0}
              w='100%'
              minH='100%'
              bgColor='rgba(0,0,0,0.5)'
              zIndex={1}
            >
              <Spinner size='xl' />
            </Center>
          )}
          <VStack alignItems='flex-start' spacing={2}>
            {cards.map((card: Card) => (
              <MiniCardItem
                {...(onCardClick && {
                  _hover: { bgColor: variables.accentColor },
                  cursor: 'pointer',
                  onClick: () => onCardClick(card)
                })}
                key={card.id}
                card={card}
                rightComponent={
                  <CardControl
                    onDetailClick={(e: any) => handleCardDetailClick(e, card)}
                    {...(onCardEditClick && {
                      onEditClick: (e: any) => handleCardEditClick(e, card)
                    })}
                  />
                }
              />
            ))}
          </VStack>
        </Box>
      </Box>
    </Scrollbars>
  );
};

CardControl.defaultProps = {
  onEditClick: undefined
};

CardList.defaultProps = {
  loading: false,
  wrapperProps: undefined,
  onCardClick: undefined,
  onCardDetailClick: undefined,
  onCardEditClick: undefined
};
