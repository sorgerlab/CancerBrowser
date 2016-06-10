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


/**
 *  Helper function to normalize a string for search
 *   comparison by lower casing, trimming, and removing dashes.
 */
export function normalize(str) {
  return String(str).toLowerCase().replace(/-/g,'').replace(/\s/g,'').trim();
}

/**
 * Helper function to convert an array of strings to a comma separated list
 */
export function toList(stringArray, accessor = (s) => s) {
  return stringArray.map((s) => String(accessor(s)).trim()).join(', ');
}
