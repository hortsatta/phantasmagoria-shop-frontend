import { gql } from '@apollo/client';

const GET_FAVORITES = gql`
  query GetFavorites(
    $where: JSON
    $limit: Int
    $start: Int
    $sort: String = "published_at:desc"
    $publicationState: PublicationState = LIVE
  ) {
    favorites(
      where: $where
      limit: $limit
      start: $start
      sort: $sort
      publicationState: $publicationState
    ) {
      id
      cardProducts: card_products(where: { isActive: true }) {
        id
        name
        description
        price
        slug
        image {
          id
          name
          url
        }
        cards {
          id
          name
          image {
            id
            name
            url
          }
          coverImage {
            id
            name
            url
          }
        }
      }
    }
  }
`;

const CREATE_FAVORITE = gql`
  mutation CreateFavorite($favorite: FavoriteInput) {
    createFavorite(input: { data: $favorite }) {
      favorite {
        id
      }
    }
  }
`;

const UPDATE_FAVORITE = gql`
  mutation UpdateFavorite($id: ID!, $favorite: editFavoriteInput) {
    updateFavorite(input: { where: { id: $id }, data: $favorite }) {
      favorite {
        id
      }
    }
  }
`;

export { GET_FAVORITES, CREATE_FAVORITE, UPDATE_FAVORITE };
