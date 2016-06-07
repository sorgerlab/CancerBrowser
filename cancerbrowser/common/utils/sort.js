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
 * Sorts by a key on the objects a and b
 */
export const sortByKey = _.curry(function (key, a, b) {
  return sortByAccessor(obj => obj[key], a, b);
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
  if (aValue > aValue) {
    return 1;
  }
  if (aValue === bValue) {
    return 0;
  }

  return NaN;
});
