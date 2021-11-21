import { FC, useContext } from 'react';
import { As, Divider, Flex, IconButtonProps } from '@chakra-ui/react';

import { PageContext } from '../contexts';
import { Icon } from './icon.component';
import { IconButton } from './icon-button.component';
import { NavActiveIndicator } from './nav-active-indicator.component';

type Props = IconButtonProps & {
  iconAs: As;
  active?: boolean;
};

export const NavItem: FC<Props> = ({ active, iconAs, ...moreProps }) => {
  const { pageLoading } = useContext(PageContext);

  return (
    <Flex alignItems='center' justifyContent='center' pos='relative' h='100%' role='group'>
      <Divider w='1px' h='70%' _groupHover={{ opacity: 0.1 }} opacity={0} orientation='vertical' />
      <IconButton
        pos='relative'
        h='100%'
        zIndex={2}
        icon={<Icon boxSizing='content-box' px={10} as={iconAs} active={active} />}
        {...moreProps}
      />
      <Divider w='1px' h='70%' _groupHover={{ opacity: 0.1 }} opacity={0} orientation='vertical' />
      <NavActiveIndicator active={active} loading={pageLoading} />
    </Flex>
  );
};

NavItem.defaultProps = {
  active: false
};
