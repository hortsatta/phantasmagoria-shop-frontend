import { gql } from '@apollo/client';

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

export { SIGN_IN, CHECK_SESSION };
