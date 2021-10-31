import { FC, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { SimpleGrid } from '@chakra-ui/react';
import { Brain, Knife, Storefront, Tray, UserCircle } from 'phosphor-react';

import { NavItem as NavItemModel } from 'models';
import { NavItem } from './nav-item.component';

// tempo
export const navConfig: { [x: string]: NavItemModel } = {
  shop: {
    path: '/shop',
    label: 'Shop',
    iconName: 'storefront'
  },
  cart: {
    path: '/cart',
    label: 'Cart',
    iconName: 'tray'
  },
  favorite: {
    path: '/favorites',
    label: 'My Favorites',
    iconName: 'knife'
  },
  user: {
    path: '/user',
    label: 'User Account',
    iconName: 'user-circle'
  },
  about: {
    path: '/about',
    label: 'About Us',
    iconName: 'brain'
  }
};

const getIcon = (name: string) => {
  switch (name) {
    case 'storefront':
      return Storefront;
    case 'tray':
      return Tray;
    case 'knife':
      return Knife;
    case 'user-circle':
      return UserCircle;
    case 'brain':
      return Brain;
    default:
      return Brain;
  }
};

type MenuItemProps = {
  active: boolean;
  item: NavItemModel;
};

const MenuItem: FC<MenuItemProps> = ({ active, item }) => {
  const Component = getIcon(item.iconName || '');

  return (
    <NavItem aria-label={item.label} active={active} iconAs={props => <Component {...props} />} />
  );
};

export const Nav: FC = () => {
  const { pathname: locationPathname } = useLocation();
  const menuItems = useMemo(
    () => Object.values(navConfig).filter(item => !item.isHidden),
    [navConfig]
  );

  const checkActivePath = useCallback(
    (path: string) => (path ? locationPathname.includes(path) : false),
    [locationPathname]
  );

  return (
    <SimpleGrid
      pos='absolute'
      alignSelf='center'
      left='50%'
      transform='translate(-50%)'
      columns={5}
      spacingX='40px'
    >
      {menuItems.map(item => (
        <MenuItem
          key={item.label.toLowerCase().trim()}
          active={checkActivePath(item.path)}
          item={item}
        />
      ))}
    </SimpleGrid>
  );
};
