import { ComponentProps, FC } from 'react';
import { Box, Center, Divider, Flex, Spinner, Stack } from '@chakra-ui/react';
import { Brain } from 'phosphor-react';

import { Card } from 'models';
import { Icon, IconButton, Scrollbars } from 'features/core/components';
import { MiniCardItem } from './mini-card-item.component';

import variables from 'assets/styles/_variables.module.scss';

type Props = ComponentProps<typeof Scrollbars> & {
  cards: Card[];
  loading?: boolean;
  onCardClick?: (card?: Card) => void;
  onCardDetailClick?: (card?: Card) => void;
};

const ViewDetailButton: FC<{ onClick: (e: any) => void }> = ({ onClick }) => (
  <Flex h='100%' alignItems='center'>
    <Divider h='80%' orientation='vertical' />
    <IconButton
      aria-label='View Card Detail'
      flex={1}
      pos='relative'
      h='100%'
      icon={<Icon w={6} boxSizing='content-box' as={Brain} />}
      onClick={onClick}
    />
  </Flex>
);

export const CardList: FC<Props> = ({
  cards,
  loading,
  onCardClick,
  onCardDetailClick,
  ...moreProps
}) => {
  const handleCardDetailClick = (e: any, card: Card) => {
    e.stopPropagation();
    onCardDetailClick && onCardDetailClick(card);
  };

  return (
    <Scrollbars className='scrollbar' hideHorizontalScroll {...moreProps}>
      <Box p={4}>
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
          <Stack spacing={2} direction='column'>
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
                  <ViewDetailButton onClick={(e: any) => handleCardDetailClick(e, card)} />
                }
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </Scrollbars>
  );
};

CardList.defaultProps = {
  loading: false,
  onCardClick: undefined,
  onCardDetailClick: undefined
};
