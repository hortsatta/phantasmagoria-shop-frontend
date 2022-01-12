import { useState, useCallback, useMemo } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';

import { messages } from 'config';
import { CREATE_ORDER, GET_PAYMENT_INTENT, UPSERT_PAYMENT_INTENT } from 'services/graphql';
import { useNotification, useDebounce } from 'features/core/hooks';
import { OrderFormData } from '../components';

type Result = {
  clientSecret: string | null;
  paymentIntentId: string | null;
  currentPaymentIntent: any;
  getPaymentIntent: (piid: string) => Promise<boolean>;
  upsertPaymentIntent: () => Promise<void>;
  addOrder: (orderFormData: OrderFormData) => Promise<void>;
  loading: boolean;
};

export const useStripeOrder = (): Result => {
  const { notify } = useNotification();
  const { debounce, loading: debounceLoading } = useDebounce();
  const [getPaymentIntentById, { data: paymentIntentData, loading: getPaymentIntentLoading }] =
    useLazyQuery(GET_PAYMENT_INTENT);
  const [upsertPayIntent, { loading: upsertPayIntentLoading }] = useMutation(UPSERT_PAYMENT_INTENT);
  const [createOrder, { loading: createOrderLoading }] = useMutation(CREATE_ORDER);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  const currentPaymentIntent = useMemo(
    () => paymentIntentData?.paymentIntent || {},
    [paymentIntentData]
  );

  const getPaymentIntent = useCallback(async (piid: string) => {
    try {
      await getPaymentIntentById({ variables: { id: piid } });
      return true;
    } catch (err) {
      notify('error', 'Failed', messages.problem);
      return false;
    }
  }, []);

  const upsertPaymentIntent = useCallback(async () => {
    debounce();
    try {
      const { data } = await upsertPayIntent();
      const { id: piid, clientSecret: cs } = data.upsertPaymentIntent || {};
      setPaymentIntentId(piid);
      setClientSecret(cs);
    } catch (err) {
      notify('error', 'Failed', messages.problem);
    }
  }, []);

  const addOrder = useCallback(
    async (orderFormData: OrderFormData) => {
      debounce();
      try {
        const { cartItems, address, ...moreOrder } = orderFormData;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: addressId, ...moreAddress } = address as any;

        const orderItems: any = cartItems.map(ci => ({
          price: ci.cardProduct.price,
          quantity: ci.quantity,
          card_product: ci.cardProduct.id
        }));

        const variables = {
          order: { ...moreOrder, address: moreAddress, orderItems, paymentIntent: paymentIntentId }
        };

        await createOrder({ variables });
      } catch (err) {
        notify('error', 'Failed', messages.problem);
      }
    },
    [clientSecret]
  );

  return {
    clientSecret,
    paymentIntentId,
    currentPaymentIntent,
    getPaymentIntent,
    upsertPaymentIntent,
    addOrder,
    loading:
      debounceLoading || upsertPayIntentLoading || createOrderLoading || getPaymentIntentLoading
  };
};
