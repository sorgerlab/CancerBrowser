import _ from 'lodash';
/**
 * Default sort function for bars if none is passed in
 * Sorts by value attribute descending.
 */
export function sortByValueAndId(a, b) {
  // sort by names if both disabled
  if(a.disabled && b.disabled) {
    return b.id < a.id ? 1 : b.id > a.id ? -1 : b.id >= a.id ? 0 : NaN;

  } else {
    // sort by value
    if (a.disabled) return 1;
    if (b.disabled) return -1;
    return b.value < a.value ? -1 : b.value > a.value ? 1 : b.value >= a.value ? 0 : NaN;
  }
}

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
