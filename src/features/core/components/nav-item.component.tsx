import { FC } from 'react';
import { As, Flex, IconButtonProps } from '@chakra-ui/react';

import { Icon } from './icon.component';
import { IconButton } from './icon-button.component';
import { NavActiveIndicator } from './nav-active-indicator.component';

type Props = IconButtonProps & {
  iconAs: As;
  active?: boolean;
};

export const NavItem: FC<Props> = ({ active, iconAs, ...moreProps }) => (
  <Flex justifyContent='center' pos='relative' h='100%'>
    <IconButton
      pos='relative'
      h='100%'
      zIndex={2}
      icon={<Icon boxSizing='content-box' px={2} as={iconAs} active={active} />}
      {...moreProps}
    />
    {active && <NavActiveIndicator />}
  </Flex>
);

NavItem.defaultProps = {
  active: false
};
