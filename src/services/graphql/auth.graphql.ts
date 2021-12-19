import { gql } from '@apollo/client';

const SIGN_IN = gql`
  mutation SignIn($identifier: String!, $password: String!) {
    login(input: { identifier: $identifier, password: $password }) {
      jwt
      currentUser: user {
        user {
          userAccount: user_account {
            id
            fullName
            displayName
            user {
              id
              email
              role {
                id
              }
            }
          }
        }
      }
    }
  }
`;

const SIGN_UP = gql`
  mutation SignUp($username: String!, $email: String!, $password: String!) {
    register(input: { username: $username, email: $email, password: $password }) {
      jwt
      currentUser: user {
        user {
          userAccount: user_account {
            id
            fullName
            displayName
            user {
              id
              email
              role {
                id
              }
            }
          }
        }
      }
    }
  }
`;

const CHECK_SESSION = gql`
  query CheckSession {
    me {
      user {
        userAccount: user_account {
          id
          fullName
          displayName
          user {
            id
            email
            role {
              id
            }
          }
        }
      }
    }
  }
`;

export { SIGN_IN, SIGN_UP, CHECK_SESSION };
