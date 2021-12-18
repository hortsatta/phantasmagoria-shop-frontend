import { useReactiveVar } from '@apollo/client';
import { notificationsVar } from 'config';

type Result = {
  notify: (status: string, title?: string, description?: string) => void;
};

export const useNotification = (): Result => {
  const notifications = useReactiveVar(notificationsVar);

  const notify = (status: string, title?: string, description?: string) => {
    const newNotification = { status, title: title || '', description: description || '' };
    const items =
      notifications.length >= 5
        ? [...notifications.splice(-1), newNotification]
        : [...notifications, newNotification];
    notificationsVar(items);
  };

  return { notify };
};
