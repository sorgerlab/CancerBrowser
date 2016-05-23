/**
 * Creates a new array that is the same as the initial array
 * except array[index] === value
 */
export function arraySet(array, index, value) {
  return array.slice(0, index).concat([value]).concat(array.slice(index + 1));
}

/**
 * Creates a new array with array[index] dropped
 */
export function arrayRemove(array, index) {
  return array.slice(0, index).concat(array.slice(index + 1));
}
