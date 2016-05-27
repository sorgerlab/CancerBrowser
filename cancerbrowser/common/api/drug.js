import { filterData, countMatchedFilterGroups } from './util';

import _ from 'lodash';

//TODO async load drug data.
import drugData from  './data/drugs.json';

export function getDrugs(filterGroups) {
  return new Promise(function(resolve) {

    var filteredDrugData = _.clone(drugData);
    Object.keys(filterGroups).forEach(function(key) {
      var filterGroup = filterGroups[key];
      filteredDrugData = filterData(filteredDrugData, filterGroup);
    });
    resolve(filteredDrugData);
  });
}

/**
 * Provides counts for each filter group in the allFilterGroup
 *
 * @param {Array} cellLines array of cell line data to match
 * @param {Object} filter groups for the cell line data.
 *
 */
export function getDrugCounts(drugs, allFilterGroups) {
  return countMatchedFilterGroups(drugs, allFilterGroups);
}
