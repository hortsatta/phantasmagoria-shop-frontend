import { MutableRefObject, useCallback, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';

import { CREATE_USER_ACCOUNT, SIGN_UP } from 'services/graphql';
import { useDebounce } from 'features/core/hooks';
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
  const { debounce, loading: debounceLoading } = useDebounce();
  const [register, { loading: registerLoading }] = useMutation(SIGN_UP);
  const [createUserAccount, { loading: createUserAccountLoading }] =
    useMutation(CREATE_USER_ACCOUNT);
  const [isSignUpComplete, setIsSignUpComplete] = useState(false);
  const [isOptionalDetailComplete, setIsOptionalDetailComplete] = useState(false);
  const currentUser = useRef<any>(null);

  const signUp = useCallback(async (user: UserFormData) => {
    const { email, password } = user;
    debounce();

    try {
      const { data } = await register({ variables: { username: email, email, password } });
      currentUser.current = data.register;
      setIsSignUpComplete(true);
    } catch (err: any) {
      // TODO
      console.error(err);
    }
  }, []);

  const addOptionalData = useCallback(async (data: UserOptionalFormData) => {
    const { displayName, fullName, ...address } = data || {};
    debounce();

    try {
      const userAccount = {
        displayName,
        fullName,
        addresses: [{ ...address, fullName }],
        user: currentUser.current.user.id
      };
      await createUserAccount({ variables: userAccount });
      setIsOptionalDetailComplete(true);
    } catch (err: any) {
      // TODO
      console.error(err);
    }
  }, []);

  return {
    loading: debounceLoading || registerLoading || createUserAccountLoading,
    isSignUpComplete,
    isOptionalDetailComplete,
    currentUser,
    setIsOptionalDetailComplete,
    signUp,
    addOptionalData
  };
};
