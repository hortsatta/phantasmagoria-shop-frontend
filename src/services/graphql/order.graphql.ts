import { gql } from '@apollo/client';

const UPSERT_PAYMENT_INTENT = gql`
  mutation UpsertPaymentIntent {
    upsertPaymentIntent {
      id
      clientSecret
    }
  }
`;

const GET_PAYMENT_INTENT = gql`
  query GetPaymentIntent($id: ID!) {
    paymentIntent(id: $id) {
      id
      amount
      status
      clientSecret
      created
    }
  }
`;

const GET_ORDERS = gql`
  query GetOrders(
    $where: JSON
    $limit: Int
    $start: Int
    $sort: String = "date:desc"
    $publicationState: PublicationState = LIVE
  ) {
    orders(
      where: $where
      limit: $limit
      start: $start
      sort: $sort
      publicationState: $publicationState
    ) {
      id
      date
      totalPrice
      orderItems {
        price
        quantity
        cardProduct: card_product {
          id
          name
        }
      }
    }
  }
`;

const GET_ORDERS_DETAIL = gql`
  query GetOrders(
    $where: JSON
    $limit: Int
    $start: Int
    $sort: String = "date:desc"
    $publicationState: PublicationState = LIVE
  ) {
    orders(
      where: $where
      limit: $limit
      start: $start
      sort: $sort
      publicationState: $publicationState
    ) {
      id
      date
      totalPrice
      address {
        id
        fullName
        phoneNumber
        region
        province
        city
        barangay
        zipCode
        addressLine
      }
      orderItems {
        price
        quantity
        cardProduct: card_product {
          id
          name
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
  }
`;

const CREATE_ORDER = gql`
  mutation CreateOrder($order: OrderInput) {
    createOrder(input: { data: $order }) {
      order {
        id
        date
        totalPrice
        orderItems {
          price
          quantity
          cardProduct: card_product {
            id
            name
          }
        }
      }
    }
  }
`;

export { UPSERT_PAYMENT_INTENT, GET_PAYMENT_INTENT, GET_ORDERS, GET_ORDERS_DETAIL, CREATE_ORDER };
