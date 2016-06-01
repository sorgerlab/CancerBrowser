/**
 * Makes a word plural unless items has only one item
 *
 * @param {Array} items
 * @param {String} word
 * @param {String} pluralSuffix
 * @return {String}
 */
export function plural(items, word, pluralSuffix = 's') {
  if (items && items.length === 1) {
    return word;
  }

  return `${word}${pluralSuffix}`;
}


// helper function to normalize a string for search comparison by lower casing and trimming
export function normalize(str) {
  return String(str).toLowerCase().trim();
}