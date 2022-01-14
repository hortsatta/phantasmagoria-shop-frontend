import { gql } from '@apollo/client';

export const GET_ABOUT_SINGLE = gql`
  query {
    about(publicationState: LIVE) {
      id
      title
      coverImage {
        id
        name
        url
      }
      slug
      content
    }
  }
`;
