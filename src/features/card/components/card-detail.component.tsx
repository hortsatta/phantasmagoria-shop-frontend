import { FC } from 'react';
import { useQuery } from '@apollo/client';
import {
  AspectRatio,
  Box,
  BoxProps,
  Center,
  Heading as ChakraHeading,
  HStack,
  Image,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react';

import { CardType } from 'models';
import { GET_CARDS_DETAIL } from 'services/graphql';

import variables from 'assets/styles/_variables.module.scss';

type Props = BoxProps & {
  id: string;
};

const Heading: FC = ({ children }) => (
  <ChakraHeading fontSize={20} as='h6'>
    {children}
  </ChakraHeading>
);

export const CardDetail: FC<Props> = ({ id, ...moreProps }) => {
  const { data: { cards = [] } = {}, loading } = useQuery(GET_CARDS_DETAIL, {
    variables: { where: { id } }
  });
  const { name, description, attr, rarity, category, types, image } = cards[0] || {};

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
            h='500px'
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
            <Box>
              <Heading>Name</Heading>
              <Text>{name}</Text>
            </Box>
            <Box>
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
            <Box>
              <Heading>Attributes</Heading>
              <Text>Offense: {attr.offense}</Text>
              <Text>Defense: {attr.defense}</Text>
              <Text>Cost: {attr.cost}</Text>
            </Box>
            <Box>
              <Heading>Rarity</Heading>
              <Text>{rarity.name}</Text>
            </Box>
            <Box>
              <Heading>Category</Heading>
              <Text>{category.name}</Text>
            </Box>
            <Box>
              <Heading>Types</Heading>
              <Text>{types.map((type: CardType) => type.name).join(', ')}</Text>
            </Box>
          </VStack>
        </HStack>
      )}
    </Box>
  );
};
