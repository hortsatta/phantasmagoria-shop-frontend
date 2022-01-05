import { MutableRefObject, useCallback, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';

import { messages } from 'config';
import { CREATE_USER_ACCOUNT, UPDATE_USER_ACCOUNT, SIGN_UP } from 'services/graphql';
import { useDebounce, useNotification } from 'features/core/hooks';
import { UserFormData, UserOptionalFormData } from '../components';

type Result = {
  loading: boolean;
  isSignUpComplete: boolean;
  isOptionalDetailComplete: boolean;
  setIsOptionalDetailComplete: any;
  currentUser: MutableRefObject<any>;
  signUp: (user: UserFormData) => void;
  addOptionalData: (data: UserOptionalFormData) => void;
};

export const useSignUp = (): Result => {
  const { notify } = useNotification();
  const { debounce, loading: debounceLoading } = useDebounce();
  const [register, { loading: registerLoading }] = useMutation(SIGN_UP);
  const [createUserAccount, { loading: createUserAccountLoading }] =
    useMutation(CREATE_USER_ACCOUNT);
  const [updateUserAccount, { loading: updateAccountLoading }] = useMutation(UPDATE_USER_ACCOUNT);
  const [isSignUpComplete, setIsSignUpComplete] = useState(false);
  const [isOptionalDetailComplete, setIsOptionalDetailComplete] = useState(false);
  const currentUser = useRef<any>(null);

  const signUp = useCallback(async (user: UserFormData) => {
    const { email, password } = user;
    debounce();

    try {
      const {
        data: { register: registerData }
      } = await register({ variables: { username: email, email, password } });
      const { data: userAccountData } = await createUserAccount({
        variables: { userAccount: { user: registerData.currentUser.user.id } }
      });
      const { jwt } = registerData;
      const { userAccount } = userAccountData.createUserAccount;

      currentUser.current = { jwt, userAccount };
      setIsSignUpComplete(true);
    } catch (err) {
      notify('error', 'Failed', messages.problem);
    }
  }, []);

  const addOptionalData = useCallback(async (data: UserOptionalFormData) => {
    const { displayName, fullName, ...address } = data || {};
    const { userAccount: currentUserAccount } = currentUser.current;
    debounce();

    try {
      const variables = {
        id: currentUserAccount.id,
        userAccount: {
          displayName,
          fullName,
          addresses: [{ ...address, fullName }]
        }
      };
      await updateUserAccount({ variables });
      setIsOptionalDetailComplete(true);
    } catch (err) {
      notify('error', 'Failed', messages.problem);
    }
  }, []);

  return {
    loading: debounceLoading || registerLoading || createUserAccountLoading || updateAccountLoading,
    isSignUpComplete,
    isOptionalDetailComplete,
    currentUser,
    setIsOptionalDetailComplete,
    signUp,
    addOptionalData
  };
};
