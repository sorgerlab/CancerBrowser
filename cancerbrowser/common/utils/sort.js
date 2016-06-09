import _ from 'lodash';

export const sortByKeysWithDisabled = _.curry(function (keys, disabledKeys, a, b) {
  // both disabled, sort with disabled keys amongst themselves
  if (a.disabled && b.disabled) {
    return sortByKeys(disabledKeys, a, b);
  }

  // one disabled
  if (a.disabled) {
    return 1;
  }
  if (b.disabled) {
    return -1;
  }

  // neither disabled, sort normally amongst themselves
  return sortByKeys(keys, a, b);
});

/**
 * sort by a series of keys
 */
export const sortByKeys = _.curry(function (keys, a, b) {
  let result, key;
  for (key of keys) {
    result = sortByKey(key, a, b);
    if (result !== 0) {
      return result;
    }
  }

  return result;
});

/**
 * Sorts by a key on the objects a and b.
 * If the key starts with "-", sorts in reverse
 */
export const sortByKey = _.curry(function (key, a, b) {
  let reverse = false;
  if (key.charAt(0) === '-') {
    key = key.substring(1);
    reverse = true;
  }

  let result = sortByAccessor(obj => obj[key], a, b);

  return reverse ? -result : result;
});

/**
 * Sorts by calling an accessor on the objects a and b
 */
export const sortByAccessor = _.curry(function (accessor, a, b) {
  const aValue = accessor(a);
  const bValue = accessor(b);

  if (a == null || aValue == null) {
    return 1;
  }
  if (b == null || bValue == null) {
    return -1;
  }

  if (_.isString(aValue) && _.isString(bValue)) {
    return aValue.localeCompare(bValue);
  }

  if (aValue < bValue) {
    return -1;
  }
  if (aValue > bValue) {
    return 1;
  }
  if (aValue === bValue) {
    return 0;
  }

  return NaN;
});
