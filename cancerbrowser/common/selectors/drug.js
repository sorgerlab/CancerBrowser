import _ from 'lodash';
import { createSelector } from 'reselect';
import { filterData, countMatchedFilterGroup } from '../api/util';

/////////////////////
// Input Selectors
/////////////////////

/**
 * An input selector for getting all drugs
 *
 * @param {Object} state The Redux state
 * @return {Array} The drugs
 */
function getDrugs(state) {
  return state.drugs.items;
}

/**
 * An input selector for getting active drug filters
 *
 * @param {Object} state The Redux state
 * @return {Object} The active filters
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

/**
 * A selector that filters the collection of drugs to match the
 * active filters.
 *
 * Input selectors:
 *   - getDrugs
 *   - getActiveFilters
 *
 * @return {Array} The filtered drugs
 */
export const getFilteredDrugs = createSelector(
  [ getDrugs, getActiveFilters ],
  (drugs, activeFilters) => {
    const activeDrugFilters = activeFilters.drugFilters;
    const filteredDrugs = filterData(drugs, activeDrugFilters);
    return _.sortBy(filteredDrugs, 'name.label');
  }
);


 /**
 * A selector that creates the filter groups based on what values are in the
 * data. Note that this does not use the filtered data since we need all the
 * potential values.
 *
 * Input selectors:
 *   - getDrugs
 *
 * @return {Array} The filter groups definition
 */
export const getFilterGroups = createSelector(
  [ getDrugs ],
  (drugs) => {
    const drugFilters = [
      {
        id: 'developmentStage',
        label: 'Development Stage',
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
        values: valuesFromLabelValueItems(drugs, 'targetGene')
      }, {
        id: 'targetRole',
        label: 'Target Gene Class',
        type: 'multi-select',
        // generate based on the data
        values: valuesFromLabelValueItems(drugs, 'targetRole')
      }, {
        id: 'targetPathway',
        label: 'Target Pathway',
        type: 'multi-select',
        // generate based on the data
        values: valuesFromLabelValueItems(drugs, 'targetPathway')
      }, {
        id: 'targetFunction',
        label: 'Target Biological Function',
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

/**
 * A selector for the count information for a set of drugs
 *
 * Input selectors:
 *   - getFilteredDrugs (a selector)
 *   - getFilterGroups (a selector)
 *
 * @return {Object} An object defining counts for drugFilters
 */
export const getFilteredDrugCounts = createSelector(
  [ getFilteredDrugs, getFilterGroups ],
  (filteredDrugs, filterGroups) => {
    const filterGroup = filterGroups.find(group => group.id === 'drugFilters');
    const counts = countMatchedFilterGroup(filteredDrugs, filterGroup);

    return { drugFilters: counts };
  }
);

/**
 * A selector for getting the current drug ID from the route
 *
 * @return {String} An object of info for a single drug
 */
const getDrugIdFromRoute = (state, props) => props.params.drugId;

/**
 * A selector for a specific drug
 *
 * Input selectors:
 *   - getDrugs
 *   - getDrugIdFromRoute
 *
 * @return {Object} An object for a single drug
 */
export const getDrug = createSelector(
  [ getDrugs, getDrugIdFromRoute ],
  ( drugs, drugId ) => drugs.find(drug => drug.id === drugId)
);
