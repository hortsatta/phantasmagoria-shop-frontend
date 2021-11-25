import { gql } from '@apollo/client';

export const GET_APP_MODULES = gql`
  query GetAppModules {
    appModules {
      modules
    }
  }
`;
