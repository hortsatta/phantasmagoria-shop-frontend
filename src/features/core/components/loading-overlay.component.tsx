import { ReactNode, FC } from 'react';
import { Center, CenterProps, Spinner } from '@chakra-ui/react';

type Props = CenterProps & {
  children?: ReactNode;
  loading?: boolean;
};

export const LoadingOverlay: FC<Props> = ({ loading, children, ...moreProps }) => (
  <>
    {loading && (
      <Center
        pos='absolute'
        top={0}
        left={0}
        w='100%'
        h='352px'
        bgColor='transparent'
        zIndex={1}
        {...moreProps}
      >
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
