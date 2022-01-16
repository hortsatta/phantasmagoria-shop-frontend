import { makeVar, ReactiveVar } from '@apollo/client';
import { isString } from './string.helper';

const getCleanValueForStorage = (value: any) => {
  return isString(value) ? value : JSON.stringify(value);
};

export const makeVarPersisted = <T>(initialValue: T, storageName: string): ReactiveVar<T> => {
  let value = initialValue;

  // Try to fetch the value from local storage
  // eslint-disable-next-line no-undef
  const previousValue = localStorage.getItem(storageName);
  if (previousValue !== null) {
    try {
      const parsed = JSON.parse(previousValue);
      value = parsed;
    } catch {
      // It wasn't JSON, assume a valid value
      value = previousValue as unknown as T;
    }
  }

  // Create a reactive var with stored/initial value
  const rv = makeVar<T>(value);

  const onNextChange = (newValue: T | undefined) => {
    try {
      // Try to add the value to local storage
      if (newValue === undefined) {
        // eslint-disable-next-line no-undef
        localStorage.removeItem(storageName);
      } else {
        // eslint-disable-next-line no-undef
        localStorage.setItem(storageName, getCleanValueForStorage(newValue));
      }
    } catch {
      // ignore
    }

    // Re-register for the next change
    rv.onNextChange(onNextChange);
  };

  // Register for the first change
  rv.onNextChange(onNextChange);

  return rv;
};
