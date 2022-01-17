import { client, currentUserAccountVar } from 'config';
import { UserAccount } from 'models';

const signIn = (jwt: string, userAccount: UserAccount, callback?: () => void) => {
  // Store token to browser local storage. and write current user to apollo cache
  localStorage.setItem('token', jwt);
  currentUserAccountVar(userAccount);
  callback && callback();
};

const signOut = (refresh?: boolean) => {
  // Remove token from local storage and clear apollo cache.
  localStorage.removeItem('token');
  client.resetStore();
  currentUserAccountVar(null);
  refresh && window.location.reload();
};

export { signIn, signOut };
