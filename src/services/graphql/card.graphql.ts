import { gql } from '@apollo/client';

const GET_ALL_RARITIES = gql`
  query GetRarities($sort: String = "name:asc") {
    rarities(sort: $sort) {
      id
      name
      slug
    }
  }
`;

const GET_ALL_CATEGORIES = gql`
  query GetCategories($sort: String = "name:asc") {
    categories(sort: $sort) {
      id
      name
      slug
    }
  }
`;

const GET_ALL_TYPES = gql`
  query GetTypes($sort: String = "name:asc") {
    types(sort: $sort) {
      id
      name
      slug
    }
  }
`;

const GET_CARDS = gql`
  query GetCards(
    $where: JSON
    $limit: Int
    $start: Int
    $sort: String = "name:asc"
    $publicationState: PublicationState = LIVE
  ) {
    cards(
      where: $where
      limit: $limit
      start: $start
      sort: $sort
      publicationState: $publicationState
    ) {
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
`;

const GET_CARDS_DETAIL = gql`
  query GetCards(
    $where: JSON
    $limit: Int
    $start: Int
    $sort: String = "name:asc"
    $publicationState: PublicationState = LIVE
  ) {
    cards(
      where: $where
      limit: $limit
      start: $start
      sort: $sort
      publicationState: $publicationState
    ) {
      id
      name
      description
      slug
      attr {
        offense
        defense
        cost
      }
      rarity {
        id
        name
      }
      category {
        id
        name
      }
      types {
        id
        name
      }
      image {
        id
        name
        url
      }
    }
  }
`;

const CREATE_CARD = gql`
  mutation CreateCard($card: CardInput) {
    createCard(input: { data: $card }) {
      card {
        id
        name
        slug
      }
    }
  }
`;

const UPDATE_CARD = gql`
  mutation UpdateCard($id: ID!, $card: editCardInput) {
    updateCard(input: { where: { id: $id }, data: $card }) {
      card {
        id
        name
        slug
      }
    }
  }
`;

export {
  GET_ALL_RARITIES,
  GET_ALL_CATEGORIES,
  GET_ALL_TYPES,
  GET_CARDS,
  GET_CARDS_DETAIL,
  CREATE_CARD,
  UPDATE_CARD
};
