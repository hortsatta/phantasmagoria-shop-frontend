import { client, currentUserVar } from 'config';
import { User } from 'models';

const signIn = (jwt: string, user: User) => {
  // Store token to browser local storage. and write current user to apollo cache
  // eslint-disable-next-line no-undef
  localStorage.setItem('token', jwt);
  currentUserVar(user);
};

const signOut = () => {
  // Remove token from local storage and clear apollo cache.
  // eslint-disable-next-line no-undef
  localStorage.removeItem('token');
  client.clearStore();
  currentUserVar(null);
};

export { signIn, signOut };
