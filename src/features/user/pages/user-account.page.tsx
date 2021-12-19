import { FC, useContext, useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';

import { appModulesVar, currentUserAccountVar } from 'config';
import { signOut } from 'services';
import { PageContext } from 'features/core/contexts';
import { useDebounce } from 'features/core/hooks';
import { PageBox } from 'features/core/components';

export const UserAccountPage: FC = () => {
  const { changePage } = useContext(PageContext);
  const { debounce } = useDebounce();
  const currentUserAccount = useReactiveVar(currentUserAccountVar);
  const appModules: any = useReactiveVar(appModulesVar);

  useEffect(() => {
    if (currentUserAccount) {
      return;
    }

    const userNav = appModules.user;
    const signInNav = appModules.user.children?.signIn;
    changePage(signInNav?.key, `${userNav.path}${signInNav?.path}`, true);
  }, [currentUserAccount]);

  const handleSignOut = () => {
    debounce(() => {
      signOut();
      const shopListNav = appModules.shop.children?.list;
      changePage(shopListNav?.key, shopListNav?.path);
    });
  };

  return (
    <PageBox>
      <span>User Account Page</span>
      <button onClick={handleSignOut} type='button'>
        Logout
      </button>
    </PageBox>
  );
};
