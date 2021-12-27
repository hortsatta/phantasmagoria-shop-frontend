import { FC } from 'react';
import { Flex, Center, Heading } from '@chakra-ui/react';

import { PageBox } from 'features/core/components';
import { CartForm } from '../components';
import { useGetCart } from '../hooks';

export const CartPage: FC = () => {
  const { cart, loading } = useGetCart();

  return (
    <PageBox d='flex' alignItems='flex-start' justifyContent='center' pb={0} h='100%' flex={1}>
      <Flex
        pt={8}
        flexDir='column'
        pb='60px'
        w='4xl'
        minH='100vh'
        pos='relative'
        justifyContent='flex-start'
      >
        <Center mb={6}>
          <Heading as='h2' fontSize='4xl'>
            My Cart
          </Heading>
        </Center>
        {cart && <CartForm w='100%' cart={cart} loading={loading} onSubmit={() => null} />}
      </Flex>
    </PageBox>
  );
};
