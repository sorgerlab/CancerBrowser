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
 * Creates a list of values from items of form { value, label }
 * sorted by label and with missing values removed
 *
 * @param {Array} collection Collection of items to iterate over
 * @param {String} labelValueKey Key to map collection on to get { value, label }
 * @return {Array}
 */
function valuesFromLabelValueItems(collection, labelValueKey) {
  return _.chain(collection)
    .map(d => d[labelValueKey])
    .keyBy('value') // keyBy value then get values to eliminate duplicates
    .values()
    .compact()
    .sortBy('label')
    .value();
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
        { value: '00-preclinical', label: 'Preclinical' },
        { value: '10-phase1', label: 'Phase 1' },
        { value: '20-phase2', label: 'Phase 2' },
        { value: '30-phase3', label: 'Phase 3' },
        { value: '40-approved', label: 'Approved' }
      ]
    }, {
      id: 'targetGene',
      label: 'Target Gene',
      type: 'multi-select',
      // generate based on the data
      values: valuesFromLabelValueItems(drugData, 'targetGene')
    }, {
      id: 'targetRole',
      label: 'Target Role',
      type: 'multi-select',
      // generate based on the data
      values: valuesFromLabelValueItems(drugData, 'targetRole')
    }, {
      id: 'targetPathway',
      label: 'Target Pathway',
      type: 'multi-select',
      // generate based on the data
      values: valuesFromLabelValueItems(drugData, 'targetPathway')
    }, {
      id: 'targetFunction',
      label: 'Target Function',
      type: 'multi-select',
      // generate based on the data
      values: valuesFromLabelValueItems(drugData, 'targetFunction')
    }
  ];

  return drugFilters;
}
