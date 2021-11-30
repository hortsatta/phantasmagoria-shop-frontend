import { useEffect, useState } from 'react';
import { DEBOUNCE_DURATION } from './use-debounce.hook';

const DEBOUNCE_LOADING_DURATION = 500;

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
      setDebouncedValue(value);
    }, delay);
    // Further delay loading to give time to execute desired function
    const debounceLoading = setTimeout(() => {
      setLoading(false);
    }, delay + DEBOUNCE_LOADING_DURATION);
    // Cancel the timeout if value changes (also on delay change or unmount)
    // This is how we prevent debounced value from updating if value is changed ...
    // .. within the delay period. Timeout gets cleared and restarted.
    return () => {
      clearTimeout(debounce);
      clearTimeout(debounceLoading);
    };
  }, [value, delay]);

  return { debouncedValue, loading };
};
