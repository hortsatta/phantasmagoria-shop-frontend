import { gql } from '@apollo/client';

const GET_CARTS = gql`
  query GetCarts(
    $where: JSON
    $limit: Int
    $start: Int
    $sort: String = "published_at:desc"
    $publicationState: PublicationState = LIVE
  ) {
    carts(
      where: $where
      limit: $limit
      start: $start
      sort: $sort
      publicationState: $publicationState
    ) {
      id
      cartItems {
        id
        quantity
        cardProduct: card_product {
          id
          name
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
    }
  }
`;

const UPDATE_CART_ITEMS = gql`
  mutation UpdateCartItems(
    $updateItems: [ComponentCartItemCartItemInput]
    $removeItems: [ComponentCartItemCartItemInput]
  ) {
    updateCartItems(updateItems: $updateItems, removeItems: $removeItems) {
      id
      cartItems {
        id
        quantity
        cardProduct: card_product {
          id
        }
      }
    }
  }
`;

export { GET_CARTS, UPDATE_CART_ITEMS };
