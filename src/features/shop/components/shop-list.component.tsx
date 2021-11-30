import { FC, ReactNode } from 'react';
import { Flex, Text } from '@chakra-ui/react';

import { CardProduct } from 'models';
import { MotionSurface } from 'features/core/components';
import { ShopItem, ShopItemSkeleton } from './shop-item.component';

import variables from 'assets/styles/_variables.module.scss';

type Props = {
  items: CardProduct[];
  loading?: boolean;
};

type PlaceholderProps = {
  children?: ReactNode;
  loading?: boolean;
};

const wrapperAnim = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const Placeholder: FC<PlaceholderProps> = ({ loading, children }) => (
  // eslint-disable-next-line react/no-array-index-key
  <>{loading ? [1, 2, 3].map(key => <ShopItemSkeleton key={key} />) : children}</>
);

export const ShopList: FC<Props> = ({ items, loading }) => (
  <Flex flexDir='column' w='100%'>
    <Flex flex={1} alignItems='flex-start' justifyContent='flex-start' flexWrap='wrap' w='100%'>
      <Placeholder loading={loading}>
        <MotionSurface
          w='100%'
          bgColor='transparent'
          borderColor='transparent'
          borderWidth={0}
          borderRadius={8}
          variants={wrapperAnim}
          initial='hidden'
          animate='show'
        >
          {items.length ? (
            items.map((item: CardProduct) => <ShopItem key={item.id} item={item} />)
          ) : (
            <Text
              mt={8}
              w='100%'
              textAlign='center'
              fontFamily={variables.primaryFont}
              fontSize='4xl'
            >
              we could only show nothing.
            </Text>
          )}
        </MotionSurface>
      </Placeholder>
    </Flex>
  </Flex>
);

ShopList.defaultProps = {
  loading: false
};

Placeholder.defaultProps = {
  children: undefined,
  loading: false
};
