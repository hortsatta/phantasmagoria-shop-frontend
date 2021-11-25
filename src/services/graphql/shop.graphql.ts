import { gql } from '@apollo/client';

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

export { CREATE_CARD_PRODUCT, UPDATE_CARD_PRODUCT };
