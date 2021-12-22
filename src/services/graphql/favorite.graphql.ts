import { gql } from '@apollo/client';

const GET_FAVORITES = gql`
  query GetFavorites(
    $userAccountId: ID
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
        favorites(where: { user_account: $userAccountId }) {
          id
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

const UPDATE_FAVORITE_ITEMS = gql`
  mutation UpdateFavoriteItems($addItems: [ID], $removeItems: [ID]) {
    updateFavoriteItems(addItems: $addItems, removeItems: $removeItems) {
      id
      cardProducts: card_products {
        id
      }
    }
  }
`;

export { GET_FAVORITES, CREATE_FAVORITE, UPDATE_FAVORITE, UPDATE_FAVORITE_ITEMS };
