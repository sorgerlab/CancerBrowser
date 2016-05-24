/**
 * Creates a new array that is the same as the initial array
 * except array[index] === value
 *
 * @param {Array} array The array to modify
 * @param {Number} index The index in the array to change
 * @param {Any} value The new value to set in the array
 * @return {Array} The modified array
 */
export function arraySet(array, index, value) {
  return [...array.slice(0, index), value, ...array.slice(index + 1)];
}

/**
 * Creates a new array with array[index] dropped
 *
 * @param {Array} array The array to modify
 * @param {Number} index The index in the array to remove
 * @return {Array} The modified array
 */
export function arrayRemove(array, index) {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}
