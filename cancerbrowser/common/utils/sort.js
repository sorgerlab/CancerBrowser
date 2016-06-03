/**
 * Default sort function for bars if none is passed in
 * Sorts by value attribute descending.
 */
export function sortByValueAndId(a,b) {
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
