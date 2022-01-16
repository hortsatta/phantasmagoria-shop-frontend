import { FC, useMemo } from 'react';
import { Flex, Divider, HStack, StackDivider, Box } from '@chakra-ui/react';
import { Brain, PenNib } from 'phosphor-react';

import { CardRbacType } from 'config/rbac';
import { Icon, IconButton } from 'features/core/components';
import { useGuard } from 'features/core/hooks';

type Props = {
  onDetailClick: (e: any) => void;
  onEditClick?: (e: any) => void;
};

const iconButtonProps = {
  w: '100%',
  h: '100%'
};

const iconButtonWrapperProps = {
  p: 1.5,
  flex: 1,
  w: '56px',
  h: '100%'
};

export const CardControl: FC<Props> = ({ onDetailClick, onEditClick }) => {
  const { canActivate } = useGuard();
  const canEdit = useMemo(
    () => canActivate([CardRbacType.UPDATE]) && !!onEditClick,
    [CardRbacType, onEditClick]
  );

  return (
    <Flex h='100%' alignItems='center'>
      <Divider h='80%' alignSelf='center' orientation='vertical' />
      <HStack
        h='100%'
        spacing={0}
        divider={<StackDivider h='80%' alignSelf='center' opacity={0.3} orientation='vertical' />}
      >
        <Box {...iconButtonWrapperProps}>
          <IconButton
            {...iconButtonProps}
            aria-label='view card detail'
            icon={<Icon w={6} boxSizing='content-box' as={Brain} />}
            onClick={onDetailClick}
          />
        </Box>
        {canEdit && (
          <Box {...iconButtonWrapperProps}>
            <IconButton
              {...iconButtonProps}
              aria-label='edit card'
              icon={<Icon w={6} boxSizing='content-box' as={PenNib} />}
              onClick={onEditClick}
            />
          </Box>
        )}
      </HStack>
    </Flex>
  );
};

CardControl.defaultProps = {
  onEditClick: undefined
};
