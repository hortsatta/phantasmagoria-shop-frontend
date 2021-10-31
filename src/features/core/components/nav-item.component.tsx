import { FC } from 'react';
import { As, IconButtonProps } from '@chakra-ui/react';

import { Icon } from './icon.component';
import { IconButton } from './icon-button.component';

type Props = IconButtonProps & {
  iconAs: As;
  active?: boolean;
};

export const NavItem: FC<Props> = ({ active, iconAs, ...moreProps }) => (
  <IconButton icon={<Icon as={iconAs} active={active} />} {...moreProps} />
);

NavItem.defaultProps = {
  active: false
};
