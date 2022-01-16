import { client, currentUserAccountVar } from 'config';
import { UserAccount } from 'models';

const signIn = (jwt: string, userAccount: UserAccount, callback?: () => void) => {
  // Store token to browser local storage. and write current user to apollo cache
  // eslint-disable-next-line no-undef
  localStorage.setItem('token', jwt);
  currentUserAccountVar(userAccount);
  callback && callback();
};

const signOut = (refresh?: boolean) => {
  // Remove token from local storage and clear apollo cache.
  // eslint-disable-next-line no-undef
  localStorage.removeItem('token');
  client.resetStore();
  currentUserAccountVar(null);
  // eslint-disable-next-line no-undef
  refresh && window.location.reload();
};

export { signIn, signOut };
