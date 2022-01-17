import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';

import { makeVarPersisted } from 'helpers';
import { AppModule, CardCategory, CardRarity, CardType, Cart, PhRegion, UserAccount } from 'models';
import { CartItemFormData } from 'features/cart/components';

const httpLink = createUploadLink({ uri: process.env.REACT_APP_API_URI });

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists.
  const token = localStorage.getItem('token');
  // Return the headers to the context so httpLink can read them.
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const appModulesVar = makeVar<{ [x: string]: AppModule } | null | undefined>(undefined);
const currentUserAccountVar = makeVar<UserAccount | null | undefined>(undefined);
const cardRaritiesVar = makeVar<CardRarity[] | null | undefined>(undefined);
const cardCategoriesVar = makeVar<CardCategory[] | null | undefined>(undefined);
const cardTypesVar = makeVar<CardType[] | null | undefined>(undefined);
const phRegionsVar = makeVar<PhRegion[] | null | undefined>(undefined);
const notificationsVar = makeVar<any[]>([]);
const favoriteItemsVar = makeVar<any[]>([]);
const favItemsLoadingVar = makeVar<boolean>(false);
const cartItemsVar = makeVar<CartItemFormData[]>([]);
const cartItemsLoadingVar = makeVar<boolean>(false);
const guestCartVar = makeVarPersisted<Cart>({ id: '0', cartItems: [] }, 'guestCart');

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        cardAppModules: {
          read() {
            return appModulesVar();
          }
        },
        currentUserAccount: {
          read() {
            return currentUserAccountVar();
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
        },
        phRegions: {
          read() {
            return phRegionsVar();
          }
        },
        notifications: {
          read() {
            return notificationsVar();
          }
        },
        favoriteItems: {
          read() {
            return favoriteItemsVar();
          }
        },
        favItemsLoading: {
          read() {
            return favItemsLoadingVar();
          }
        },
        cartItems: {
          read() {
            return cartItemsVar();
          }
        },
        cartItemsLoading: {
          read() {
            return cartItemsLoadingVar();
          }
        },
        guestCart: {
          read() {
            return guestCartVar();
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

export {
  appModulesVar,
  currentUserAccountVar,
  cardRaritiesVar,
  cardCategoriesVar,
  cardTypesVar,
  phRegionsVar,
  notificationsVar,
  favoriteItemsVar,
  favItemsLoadingVar,
  cartItemsVar,
  cartItemsLoadingVar,
  guestCartVar,
  client
};
