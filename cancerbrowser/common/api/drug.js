import _ from 'lodash';

//TODO async load drug data.
import drugData from  '../assets/data/drugs.json';

/**
 * Returns all drugs
 *
 * @return {Promise} resolves to an array of drugs
 */
export function getDrugs() {
  return new Promise(function(resolve) {
    resolve(_.clone(drugData));
  });
}

/**
 * Returns info for particular drug
 */
export function getDrugInfo(drugId) {
  return getDrugs().then(function(drugs) {
    return drugs.filter((d) => d.id === drugId)[0];
  });
}
