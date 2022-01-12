import { ComponentProps, FC } from 'react';
import { Box, BoxProps, VStack } from '@chakra-ui/react';

import { Order } from 'models';
import { FormSectionHeading, LoadingOverlay, Scrollbars } from 'features/core/components';
import { MiniOrderItem } from './mini-order-item.component';

import variables from 'assets/styles/_variables.module.scss';

type Props = BoxProps & {
  orders: Order[];
  loading?: boolean;
  scrollbarsProps?: ComponentProps<typeof Scrollbars>;
  onClickItem?: (order: Order) => void;
};

export const OrderList: FC<Props> = ({
  orders,
  loading,
  scrollbarsProps,
  onClickItem,
  ...moreProps
}) => (
  <Box {...moreProps}>
    <FormSectionHeading pt={0}>Purchases</FormSectionHeading>
    <Scrollbars className='scrollbar' hideHorizontalScroll {...scrollbarsProps}>
      <LoadingOverlay w='100%' h='100%' loading={loading}>
        <VStack alignItems='flex-start' spacing={4}>
          {orders.map((order: Order) => (
            <MiniOrderItem
              key={order.id}
              order={order}
              {...(onClickItem && {
                onClick: () => onClickItem(order),
                cursor: 'pointer',
                _hover: { bgColor: variables.accentColor },
                sx: { transition: '0.12s ease background' }
              })}
            />
          ))}
        </VStack>
      </LoadingOverlay>
    </Scrollbars>
  </Box>
);

OrderList.defaultProps = {
  loading: false,
  scrollbarsProps: undefined,
  onClickItem: undefined
};
