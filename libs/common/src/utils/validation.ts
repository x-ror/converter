export const isEnvTruthful = (value: string | boolean | number | undefined): boolean => {
  return value === true || value === 'true' || value === 1 || value === '1';
};

export const isEmpty = (
  value: unknown,
): value is null | undefined | '' | [] | Record<string, never> => {
  if (typeof value === 'number' || typeof value === 'boolean') {
    return false;
  }
  if (typeof value === 'undefined' || value === null) {
    return true;
  }
  if (value instanceof Date) {
    return false;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return true;
    }
    if (value.every(isEmpty)) {
      return true;
    }
  }
  if (value instanceof Map || value instanceof Set) {
    if (value.size === 0) {
      return true;
    }
    if (Array.from(value).every(isEmpty)) {
      return true;
    }

    return false;
  }
  if (value instanceof Object && !Object.keys(value).length) {
    return true;
  }
  if (value === '') {
    return true;
  }

  return false;
};
