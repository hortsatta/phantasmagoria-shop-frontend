import { ReactNode, FC } from 'react';
import { Center, Spinner } from '@chakra-ui/react';

type Props = {
  children?: ReactNode;
  loading?: boolean;
};

export const LoadingOverlay: FC<Props> = ({ loading, children }) => (
  <>
    {loading && (
      <Center pos='absolute' top={0} left={0} w='100%' h='352px' bgColor='transparent' zIndex={1}>
        <Spinner size='xl' />
      </Center>
    )}
    {children}
  </>
);

LoadingOverlay.defaultProps = {
  children: undefined,
  loading: false
};
