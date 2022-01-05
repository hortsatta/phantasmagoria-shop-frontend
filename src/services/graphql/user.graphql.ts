import { gql } from '@apollo/client';

const GET_USER_ACCOUNTS = gql`
  query GetUserAccounts(
    $where: JSON
    $limit: Int
    $start: Int
    $sort: String = "fullName:asc"
    $publicationState: PublicationState = LIVE
  ) {
    userAccounts(
      where: $where
      limit: $limit
      start: $start
      sort: $sort
      publicationState: $publicationState
    ) {
      id
      fullName
      displayName
      addresses {
        id
        fullName
        phoneNumber
        region
        province
        city
        barangay
        zipCode
        addressLine
        isDefault
      }
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

const CREATE_USER_ACCOUNT = gql`
  mutation CreateUserAccount($userAccount: UserAccountInput) {
    createUserAccount(input: { data: $userAccount }) {
      userAccount {
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
`;

const UPDATE_USER_ACCOUNT = gql`
  mutation UpdateUserAccount($id: ID!, $userAccount: editUserAccountInput) {
    updateUserAccount(input: { where: { id: $id }, data: $userAccount }) {
      userAccount {
        id
        displayName
        fullName
        addresses {
          fullName
          phoneNumber
          region
          province
          city
          barangay
          zipCode
          addressLine
          isDefault
        }
      }
    }
  }
`;

export { GET_USER_ACCOUNTS, CREATE_USER_ACCOUNT, UPDATE_USER_ACCOUNT };
