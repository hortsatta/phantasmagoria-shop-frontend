import { useState } from 'react';

export const DEBOUNCE_DURATION = 800;

export const useDebounce = (): {
  debounce: (callback?: () => void, duration?: number) => void;
  loading: boolean;
} => {
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
