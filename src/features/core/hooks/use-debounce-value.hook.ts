import { useEffect, useState } from 'react';
import { DEBOUNCE_DURATION } from './use-debounce.hook';

export const useDebounceValue = (
  value: any,
  delay = DEBOUNCE_DURATION
): { debouncedValue: any; loading: boolean } => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Update debounced value after delay
    const debounce = setTimeout(() => {
      setLoading(false);
      setDebouncedValue(value);
    }, delay);
    // Cancel the timeout if value changes (also on delay change or unmount)
    // This is how we prevent debounced value from updating if value is changed ...
    // .. within the delay period. Timeout gets cleared and restarted.
    return () => {
      clearTimeout(debounce);
    };
  }, [value, delay]);

  return { debouncedValue, loading };
};
