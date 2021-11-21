import { FC, useCallback, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { SimpleGrid } from '@chakra-ui/react';
import { Brain, Knife, Storefront, Tray, UserCircle } from 'phosphor-react';

import { NavItem as NavItemModel } from 'models';
import { PageContext } from '../contexts';
import { NavItem } from './nav-item.component';

// tempo
export const navConfig: { [x: string]: NavItemModel } = {
  shop: {
    key: 'shop',
    path: '/shop',
    label: 'Shop',
    children: {
      list: {
        key: 'shop-list',
        path: '/',
        label: 'Shop List',
        hidden: true
      },
      landing: {
        key: 'shop-landing',
        path: '/landing',
        label: 'Landing',
        iconName: 'storefront'
      }
    }
  },
  cart: {
    key: 'cart',
    path: '/cart',
    label: 'Cart',
    iconName: 'tray'
  },
  favorite: {
    key: 'favorite',
    path: '/favorites',
    label: 'My Favorites',
    iconName: 'knife'
  },
  user: {
    key: 'user',
    path: '/user',
    label: 'User',
    children: {
      account: {
        key: 'user-account',
        path: '/',
        label: 'User Account',
        iconName: 'user-circle'
      },
      signIn: {
        key: 'user-sign-in',
        path: '/sign-in',
        label: 'Sign In',
        hidden: true
      },
      signUp: {
        key: 'user-sign-up',
        path: '/sign-up',
        label: 'Sign Up',
        hidden: true
      }
    }
  },
  about: {
    key: 'about',
    path: '/about',
    label: 'About Us',
    iconName: 'brain'
  },
  card: {
    key: 'card',
    path: '/card',
    label: 'Card',
    children: {
      add: {
        key: 'card-add',
        path: '/add',
        label: 'New Card',
        hidden: true
      },
      edit: {
        key: 'card-edit',
        path: '/edit',
        label: 'Update Card',
        hidden: true
      }
    }
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
  onClick?: () => void;
};

const MenuItem: FC<MenuItemProps> = ({ active, item, onClick }) => {
  const Component = getIcon(item.iconName || '');

  return (
    <NavItem
      aria-label={item.label}
      active={active}
      iconAs={props => <Component {...props} />}
      onClick={onClick}
    />
  );
};

MenuItem.defaultProps = {
  onClick: undefined
};

export const Nav: FC = () => {
  const { pathname: locationPathname } = useLocation();
  const { currentPageKey, changePage } = useContext(PageContext);

  const menuItems = useMemo(
    () => Object.values(navConfig).filter(item => !item.hidden),
    [navConfig]
  );

  const getMenuChildren = useCallback(
    children => Object.values(children).filter((childItem: any) => !childItem.hidden),
    [navConfig]
  );

  const checkActivePath = useCallback(
    (path: string) => (path ? locationPathname.includes(path) : false),
    [locationPathname]
  );

  const handleNavigate = (key: string, path: string) => {
    changePage(key, path);
  };

  return (
    <SimpleGrid
      pos='absolute'
      alignSelf='center'
      left='50%'
      h='100%'
      transform='translate(-50%)'
      columns={5}
    >
      {menuItems.map(item =>
        item.children ? (
          getMenuChildren(item.children).map((childItem: any) => (
            <MenuItem
              key={childItem.key}
              active={checkActivePath(`${item.path}`) || currentPageKey === childItem.key}
              item={childItem}
              onClick={() => handleNavigate(childItem.key, `${item.path}${childItem.path}`)}
            />
          ))
        ) : (
          <MenuItem
            key={item.key}
            active={checkActivePath(item.path) || currentPageKey === item.key}
            item={item}
            onClick={() => handleNavigate(item.key, item.path)}
          />
        )
      )}
    </SimpleGrid>
  );
};
