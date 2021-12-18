import { useCallback } from 'react';
import { useMutation } from '@apollo/client';

import { messages } from 'config';
import { signIn as doSignIn } from 'services';
import { SIGN_IN } from 'services/graphql';
import { useDebounce, useNotification } from 'features/core/hooks';

type Result = {
  signIn: (identifier: string, password: string) => Promise<void>;
  loading: boolean;
};

export const useAuth = (): Result => {
  const { notify } = useNotification();
  const { debounce, loading: debounceLoading } = useDebounce();
  const [login, { loading: loginLoading }] = useMutation(SIGN_IN);

  const signIn = useCallback(async (identifier: string, password: string) => {
    debounce();
    try {
      const { data } = await login({ variables: { identifier, password } });
      const { jwt, user } = data.login;
      doSignIn(jwt, user);
    } catch (err) {
      notify('error', 'Failed', messages.signInFailed);
    }
  }, []);

  return { signIn, loading: debounceLoading || loginLoading };
};
