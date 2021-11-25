import { FC, useCallback, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { SimpleGrid } from '@chakra-ui/react';
import { Brain, Knife, Storefront, Tray, UserCircle } from 'phosphor-react';

import { appModulesVar } from 'config';
import { AppModule } from 'models';
import { PageContext } from '../contexts';
import { NavItem } from './nav-item.component';

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
  item: AppModule;
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
  const appModules = useReactiveVar(appModulesVar);

  const menuItems = useMemo(
    () => (appModules ? Object.values(appModules).filter(item => !item.hidden) : []),
    [appModules]
  );

  const getMenuChildren = useCallback(
    children => Object.values(children).filter((childItem: any) => !childItem.hidden),
    [appModules]
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
