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

/**
 * Provides the filter definition for drugs, generated based on
 * values in the data.
 *
 * @return {Array}
 */
export function getDrugFilters() {
  const drugFilters = [
    {
      id: 'class',
      label: 'Class',
      type: 'multi-select',
      values: [
        { value: 'preclinical', label: 'Preclinical' },
        { value: 'phase1', label: 'Phase 1' },
        { value: 'phase2', label: 'Phase 2' },
        { value: 'phase3', label: 'Phase 3' },
        { value: 'approved', label: 'Approved' }
      ]
    }, {
      id: 'target',
      label: 'Target / Pathway',
      type: 'multi-select',
      // generate based on the data
      values: _.chain(drugData)
        .map(d => d.nominalTarget)
        .keyBy('value')
        .values()
        .compact()
        .sortBy('label')
        .value()
    }
  ];

  return drugFilters;
}
