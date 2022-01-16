import { FC } from 'react';
import { useQuery } from '@apollo/client';
import ReactMarkdown from 'react-markdown';
import { Flex, Center, Heading, HStack, Link, Text, VStack, StackDivider } from '@chakra-ui/react';
import { ArrowSquareOut } from 'phosphor-react';

import { GET_ABOUT_SINGLE } from 'services/graphql';
import { Icon, PageBox, Surface } from 'features/core/components';

export const AboutPage: FC = () => {
  const { data: { about } = {} } = useQuery(GET_ABOUT_SINGLE);
  const { title, content } = about || {};

  return (
    <PageBox
      d='flex'
      alignItems='flex-start'
      justifyContent='center'
      pb={0}
      h='100%'
      flex={1}
      pageTitle='About'
    >
      <Flex
        pt={8}
        flexDir='column'
        pb='60px'
        w='4xl'
        minH='100vh'
        pos='relative'
        justifyContent='flex-start'
        alignItems='center'
      >
        <Center mb={6}>
          <Heading as='h2' fontSize='4xl'>
            {title}
          </Heading>
        </Center>
        <Surface maxW='3xl' p={12}>
          <VStack spacing={12}>
            <ReactMarkdown>{content}</ReactMarkdown>
            <HStack spacing={6} divider={<StackDivider />}>
              <Link
                d='flex'
                alignItems='center'
                href='https://github.com/hortsatta/phantasmagoria-shop-frontend'
                isExternal
              >
                <Text mr={2}>phantasmagoria-shop-frontend</Text>
                <Icon w={6} as={ArrowSquareOut} />
              </Link>
              <Link
                d='flex'
                alignItems='center'
                href='https://github.com/hortsatta/phantasmagoria-shop-backend'
                isExternal
              >
                <Text mr={2}>phantasmagoria-shop-backend</Text>
                <Icon w={6} as={ArrowSquareOut} />
              </Link>
            </HStack>
          </VStack>
        </Surface>
      </Flex>
    </PageBox>
  );
};
