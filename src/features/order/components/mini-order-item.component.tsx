import { ComponentProps, FC, useMemo } from 'react';
import dayjs from 'dayjs';
import { Badge, HStack, Flex, Text } from '@chakra-ui/react';
import { CheckCircle } from 'phosphor-react';

import { formatPrice } from 'helpers';
import { Order } from 'models';
import { Icon, MotionSurface, SubHeading } from 'features/core/components';

import variables from 'assets/styles/_variables.module.scss';

type Props = Omit<ComponentProps<typeof MotionSurface>, 'order'> & {
  order: Order;
};

export const MiniOrderItem: FC<Props> = ({ order, ...moreProps }) => {
  const { date, orderItems, totalPrice = 0 } = order || {};
  const formattedDate = useMemo(
    () => (date ? dayjs(date).format('YYYY-MMM-DD').toUpperCase() : ''),
    [date]
  );
  const itemCount = useMemo(() => `${orderItems?.length || 0} items`, [orderItems]);

  return (
    <MotionSurface
      pl={4}
      pos='relative'
      justifyContent='space-between'
      alignItems='center'
      w='100%'
      h='60px'
      bgColor={variables.inputBgFocusColor}
      borderRadius={4}
      overflow='hidden'
      initial={{ opacity: 0, transform: 'translateX(-32px)' }}
      animate={{ opacity: 1, transform: 'translateX(0px)' }}
      layout
      {...moreProps}
    >
      <HStack spacing={4}>
        <Icon w={8} as={CheckCircle} color={variables.successColor} />
        <Text w='150px' flexGrow={0}>
          {formattedDate}
        </Text>
      </HStack>
      <Badge
        d='flex'
        alignItems='center'
        justifyContent='center'
        minW='100px'
        h='60%'
        fontSize={14}
        textAlign='center'
        variant='subtle'
      >
        {itemCount}
      </Badge>
      <HStack h='100%' spacing={0}>
        <SubHeading mr={4} fontSize='3xl'>
          Total
        </SubHeading>
        <Flex
          pr={4}
          flexGrow={0}
          alignItems='center'
          justifyContent='flex-end'
          minW='120px'
          h='100%'
          bgColor={variables.accentColor}
          borderTopLeftRadius='99px'
          borderBottomLeftRadius='99px'
          overflow='hidden'
        >
          <Text fontSize={18} lineHeight={1}>
            {formatPrice(totalPrice)}
          </Text>
        </Flex>
      </HStack>
    </MotionSurface>
  );
};
