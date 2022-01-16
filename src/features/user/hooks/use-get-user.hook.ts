import { useQuery, useReactiveVar } from '@apollo/client';
import { useMemo } from 'react';

import { currentUserAccountVar } from 'config';
import { UserAccount } from 'models';
import { GET_USER_ACCOUNTS } from 'services/graphql';

type Result = {
  userAccount: UserAccount | null;
  loading: boolean;
};

export const useGetUser = (id?: string): Result => {
  const currentUserAccount = useReactiveVar(currentUserAccountVar);

  const { data: { userAccounts = [] } = {}, loading } = useQuery(GET_USER_ACCOUNTS, {
    variables: { where: { id: id || currentUserAccount?.id || '' } }
  });

  const userAccount = useMemo(
    () => (!userAccounts.length ? null : userAccounts[0]),
    [userAccounts]
  );

  return { userAccount, loading };
};
