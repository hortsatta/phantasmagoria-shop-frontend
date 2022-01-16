import { FC } from 'react';
import { Center, Heading, Text } from '@chakra-ui/react';

import { PageBox } from 'features/core/components';
import variables from 'assets/styles/_variables.module.scss';

export const NotFoundPage: FC = () => (
  <PageBox
    d='flex'
    alignItems='flex-start'
    justifyContent='center'
    pb={0}
    h='100%'
    flex={1}
    pageTitle='404 Error'
    pageDescription='404. Page does not exist.'
  >
    <Center flexDir='column' w='100%' maxW='7xl' minH='80vh' pos='relative' justifyContent='center'>
      <Heading as='h2' fontSize='3xl'>
        You are on an unknown dimension. Turn back
      </Heading>
      <Text fontFamily={variables.primaryFont} fontSize='4xl'>
        404. page not found.
      </Text>
    </Center>
  </PageBox>
);
