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

// const CREATE_CARD = gql`
//   mutation CreateCard($cardInput: CardInput) {
//     createCard(input: { data: $cardInput }) {
//       card {
//         id
//         name
//         description
//         attr {
//           offense
//           defense
//           cost
//         }
//         rarity {
//           id
//           name
//         }
//         category {
//           id
//           name
//         }
//         types {
//           id
//           name
//         }
//       }
//     }
//   }
// `;

export { GET_ALL_RARITIES, GET_ALL_CATEGORIES, GET_ALL_TYPES, CREATE_CARD, UPDATE_CARD };
