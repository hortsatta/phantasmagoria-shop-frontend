import { FC, useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { useToast } from '@chakra-ui/react';

import { notificationsVar } from 'config';

export const Notifications: FC = () => {
  const toast = useToast();
  const notifications = useReactiveVar(notificationsVar);

  useEffect(() => {
    if (!notifications || !notifications.length) {
      return;
    }

    const { title, description, status } = notifications[notifications.length - 1];
    toast({ title, description, status, duration: 9000, isClosable: true, variant: 'subtle' });
  }, [notifications]);

  return null;
};
