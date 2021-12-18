import { useState } from 'react';

type Result = {
  debounce: (callback?: () => void, duration?: number) => void;
  loading: boolean;
};

export const DEBOUNCE_DURATION = 800;

export const useDebounce = (): Result => {
  const [loading, setLoading] = useState(false);

  const debounce = (callback?: () => void, duration?: number) => {
    if (loading) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      callback && callback();
      setLoading(false);
    }, duration || DEBOUNCE_DURATION);
  };

  return { debounce, loading };
};
