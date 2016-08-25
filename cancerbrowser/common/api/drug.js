import drugData from  '../assets/data/drugs.json';

/**
 * Returns drug data
 * Data is imported directly from JSON file, but for future compatability with
 * an asynchronous retrieveal mechanism, this returns a
 * Promise
 *
 * @return {Promise}
 */
export function getDrugs() {
  return Promise.resolve(drugData);
}
