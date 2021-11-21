import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';

import { CardCategory, CardRarity, CardType, User } from 'models';

const httpLink = createUploadLink({ uri: process.env.REACT_APP_API_URI });

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists.
  // eslint-disable-next-line no-undef
  const token = localStorage.getItem('token');
  // Return the headers to the context so httpLink can read them.
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const currentUserVar = makeVar<User | null | undefined>(undefined);
const cardRaritiesVar = makeVar<CardRarity[] | null | undefined>(undefined);
const cardCategoriesVar = makeVar<CardCategory[] | null | undefined>(undefined);
const cardTypesVar = makeVar<CardType[] | null | undefined>(undefined);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        currentUser: {
          read() {
            return currentUserVar();
          }
        },
        cardRarities: {
          read() {
            return cardRaritiesVar();
          }
        },
        cardCategories: {
          read() {
            return cardCategoriesVar();
          }
        },
        cardTypes: {
          read() {
            return cardTypesVar();
          }
        }
      }
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  connectToDevTools: true
});

export { currentUserVar, cardRaritiesVar, cardCategoriesVar, cardTypesVar, client };
