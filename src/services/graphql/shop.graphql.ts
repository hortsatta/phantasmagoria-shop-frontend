import { gql } from '@apollo/client';

const GET_CARD_PRODUCTS = gql`
  query GetCardProducts(
    $where: JSON
    $limit: Int
    $start: Int
    $sort: String = "published_at:desc"
    $publicationState: PublicationState = LIVE
  ) {
    cardProducts(
      where: $where
      limit: $limit
      start: $start
      sort: $sort
      publicationState: $publicationState
    ) {
      id
      name
      description
      cards {
        id
        name
        coverImage {
          id
          name
          url
        }
      }
    }
  }
`;

const CREATE_CARD_PRODUCT = gql`
  mutation CreateCardProduct($cardProduct: CardProductInput) {
    createCardProduct(input: { data: $cardProduct }) {
      cardProduct {
        id
        name
        slug
      }
    }
  }
`;

const UPDATE_CARD_PRODUCT = gql`
  mutation UpdateCardProduct($id: ID!, $cardProduct: editCardProductInput) {
    updateCardProduct(input: { where: { id: $id }, data: $cardProduct }) {
      cardProduct {
        id
        name
        slug
      }
    }
  }
`;

export { GET_CARD_PRODUCTS, CREATE_CARD_PRODUCT, UPDATE_CARD_PRODUCT };
