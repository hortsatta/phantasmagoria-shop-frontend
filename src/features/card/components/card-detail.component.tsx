import { FC, useEffect } from 'react';
import {
  AspectRatio,
  Box,
  BoxProps,
  Center,
  HStack,
  Image,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react';

import { CardType } from 'models';
import { FormSectionHeading } from 'features/core/components';
import { useGetCardsDetailByIds } from '../hooks';

import variables from 'assets/styles/_variables.module.scss';

type Props = BoxProps & {
  id: string;
};

const Heading: FC = ({ children }) => (
  <FormSectionHeading pt={0} pb={2} headingProps={{ fontSize: 20, as: 'h6' }}>
    {children}
  </FormSectionHeading>
);

export const CardDetail: FC<Props> = ({ id, ...moreProps }) => {
  const { cards, setCardIds, loading } = useGetCardsDetailByIds();
  const { name, description, attr, rarity, category, types, image } = cards[0] || {};

  useEffect(() => setCardIds([id]), [id]);

  return (
    <Box {...moreProps}>
      {loading && (
        <Center pos='absolute' top={0} left={0} w='100%' minH='100%' zIndex={1}>
          <Spinner size='xl' />
        </Center>
      )}
      {!!cards.length && (
        <HStack spacing={4} alignItems='flex-start'>
          <AspectRatio
            flexShrink={0}
            maxW='359px'
            w='100%'
            bgColor={variables.inputBgColor}
            borderColor='rgba(255,255,255,0.06)'
            borderWidth='1px'
            borderRadius={8}
            overflow='hidden'
            ratio={79 / 110}
          >
            {image && <Image src={image.url} alt={name} objectFit='cover' />}
          </AspectRatio>
          <VStack pt={4} minW='250px' alignItems='flex-start' spacing={4}>
            <Box w='100%'>
              <Heading>Name</Heading>
              <Text>{name}</Text>
            </Box>
            <Box w='100%'>
              <Heading>Description</Heading>
              <Text
                overflow='hidden'
                display='-webkit-box'
                lineHeight={1.4}
                css={{
                  '-webkit-line-clamp': '3',
                  '-webkit-box-orient': 'vertical'
                }}
              >
                {description}
              </Text>
            </Box>
            <Box w='100%'>
              <Heading>Attributes</Heading>
              <Text>Offense: {attr.offense}</Text>
              <Text>Defense: {attr.defense}</Text>
              <Text>Cost: {attr.cost}</Text>
            </Box>
            <Box w='100%'>
              <Heading>Rarity</Heading>
              <Text>{rarity.name}</Text>
            </Box>
            <Box w='100%'>
              <Heading>Category</Heading>
              <Text>{category.name}</Text>
            </Box>
            <Box w='100%'>
              <Heading>Types</Heading>
              <Text>{types.map((type: CardType) => type.name).join(', ')}</Text>
            </Box>
          </VStack>
        </HStack>
      )}
    </Box>
  );
};
