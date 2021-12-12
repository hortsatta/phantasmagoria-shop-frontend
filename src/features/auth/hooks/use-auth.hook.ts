import { useMutation } from '@apollo/client';

import { signIn as doSignIn } from 'services';
import { SIGN_IN } from 'services/graphql';
import { useDebounce } from 'features/core/hooks';

type Result = {
  signIn: (identifier: string, password: string) => Promise<void>;
  loading: boolean;
};

export const useAuth = (): Result => {
  const { debounce, loading: debounceLoading } = useDebounce();
  const [login, { loading: loginLoading }] = useMutation(SIGN_IN);

  const signIn = async (identifier: string, password: string) => {
    try {
      debounce();
      const { data } = await login({ variables: { identifier, password } });
      const { jwt, user } = data.login;
      doSignIn(jwt, user);
    } catch (err) {
      // TODO
      console.log('err', err);
    }
  };

  return { signIn, loading: debounceLoading || loginLoading };
};
