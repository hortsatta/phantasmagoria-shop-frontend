import { gql } from '@apollo/client';

import { client, currentUserVar } from 'config';
import { User } from 'models';

const SIGN_IN = gql`
  mutation SignIn($identifier: String!, $password: String!) {
    login(input: { identifier: $identifier, password: $password }) {
      jwt
      user {
        id
        email
        role {
          id
        }
      }
    }
  }
`;

const CHECK_SESSION = gql`
  query CheckSession {
    me {
      id
      email
      role {
        id
      }
    }
  }
`;

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

export { SIGN_IN, CHECK_SESSION, signIn, signOut };
