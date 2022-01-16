import { ComponentProps, FC } from 'react';
import { Box, BoxProps, Center, Spinner, VStack } from '@chakra-ui/react';

import { Card } from 'models';
import { Scrollbars } from 'features/core/components';
import { CardControl } from './card-control.component';
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

CardList.defaultProps = {
  loading: false,
  wrapperProps: undefined,
  onCardClick: undefined,
  onCardDetailClick: undefined,
  onCardEditClick: undefined
};
