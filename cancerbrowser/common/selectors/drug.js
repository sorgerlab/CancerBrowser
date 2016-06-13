import _ from 'lodash';
import { createSelector } from 'reselect';
import { filterData, countMatchedFilterGroup } from '../api/util';

/////////////////////
// Input Selectors
/////////////////////
function getDrugs(state) {
  return state.drugs.items;
}

/* Get the active filters
 *
 * @param {Object} state The Redux state
 * @return The active filters
 */
function getActiveFilters(state) {
  return state.drugs.activeFilters;
}


/////////////////////
// Helpers
/////////////////////

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



/////////////////////
// Selectors
/////////////////////

export const getFilteredDrugs = createSelector(
  [ getDrugs, getActiveFilters ],
  (drugs, activeFilters) => {
    const activeDrugFilters = activeFilters.drugFilters;
    const filteredDrugs = filterData(drugs, activeDrugFilters);
    return _.sortBy(filteredDrugs, 'name.label');
  }
);

/**
 * Provides the filter definition for drugs, generated based on
 * values in the data.
 *
 * @return {Array}
 */
export const getFilterGroups = createSelector(
  [ getDrugs ],
  (drugs) => {
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
        label: 'Gene',
        type: 'multi-select',
        // generate based on the data
        values: valuesFromLabelValueItems(drugs, 'targetGene')
      }, {
        id: 'targetRole',
        label: 'Gene Class',
        type: 'multi-select',
        // generate based on the data
        values: valuesFromLabelValueItems(drugs, 'targetRole')
      }, {
        id: 'targetPathway',
        label: 'Pathway',
        type: 'multi-select',
        // generate based on the data
        values: valuesFromLabelValueItems(drugs, 'targetPathway')
      }, {
        id: 'targetFunction',
        label: 'Biological Function',
        type: 'multi-select',
        // generate based on the data
        values: valuesFromLabelValueItems(drugs, 'targetFunction')
      }
    ];


    return [{
      id: 'drugFilters',
      label: 'Drug Filters',
      filters: drugFilters
    }];
  }
);


export const getFilteredDrugCounts = createSelector(
  [ getFilteredDrugs, getFilterGroups ],
  (filteredDrugs, filterGroups) => {
    const filterGroup = filterGroups.find(group => group.id === 'drugFilters');
    const counts = countMatchedFilterGroup(filteredDrugs, filterGroup);

    return { drugFilters: counts };
  }
);
