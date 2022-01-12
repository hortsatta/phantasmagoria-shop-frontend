import { useCallback } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';

import { currentUserAccountVar, messages } from 'config';
import { UPDATE_USER_ACCOUNT } from 'services/graphql';
import { useDebounce, useNotification } from 'features/core/hooks';
import { AddressFormData } from '../components';

type Result = {
  updateUserAccount: (userAccount: any) => void;
  updateAddress: (data: AddressFormData[]) => Promise<void>;
  loading: boolean;
};

export const useEditUser = (id?: string): Result => {
  const currentUserAccount = useReactiveVar(currentUserAccountVar);
  const { notify } = useNotification();
  const { debounce, loading: debounceLoading } = useDebounce();
  const [updateUserAcc, { loading: updateUserAccLoading }] = useMutation(UPDATE_USER_ACCOUNT);

  const updateUserAccount = useCallback(
    async (userAccount: any) => {
      debounce();
      const { id: userAccountId, ...moreUserAccount } = userAccount;

      try {
        const variables = { id: userAccountId, userAccount: moreUserAccount };
        updateUserAcc({ variables });
      } catch (err) {
        notify('error', 'Failed', messages.problem);
      }
    },
    [currentUserAccount, updateUserAcc]
  );

  const updateAddress = useCallback(
    async (addressFormData: AddressFormData[]) => {
      debounce();

      const targetAddressData = addressFormData.map((address: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { __typename, ...moreAddress } = address;
        return moreAddress;
      });

      try {
        const variables = {
          id: id || currentUserAccount?.id || 0,
          userAccount: {
            addresses: targetAddressData
          }
        };

        await updateUserAcc({ variables });
      } catch (err) {
        notify('error', 'Failed', messages.problem);
      }
    },
    [currentUserAccount, updateUserAcc]
  );

  return {
    updateUserAccount,
    updateAddress,
    loading: debounceLoading || updateUserAccLoading
  };
};
