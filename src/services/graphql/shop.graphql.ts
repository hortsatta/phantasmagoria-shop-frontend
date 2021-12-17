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
        coverImage {
          id
          name
          url
        }
      }
    }
  }
`;

const GET_CARD_PRODUCTS_DETAIL = gql`
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
`;

const GET_CARD_PRODUCTS_DETAIL_EDIT = gql`
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
      price
      slug
      isActive
      image {
        id
        name
        url
      }
      cards {
        id
        name
        slug
        rarity {
          id
          name
        }
        category {
          id
          name
        }
        coverImage {
          id
          name
          hash
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

const DELETE_CARD_PRODUCT = gql`
  mutation DeleteCardProduct($id: ID!) {
    deleteCardProduct(input: { where: { id: $id } }) {
      cardProduct {
        id
        name
        slug
      }
    }
  }
`;

export {
  GET_CARD_PRODUCTS,
  GET_CARD_PRODUCTS_DETAIL,
  GET_CARD_PRODUCTS_DETAIL_EDIT,
  CREATE_CARD_PRODUCT,
  UPDATE_CARD_PRODUCT,
  DELETE_CARD_PRODUCT
};
