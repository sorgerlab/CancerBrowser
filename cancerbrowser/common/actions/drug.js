import api from '../api';

export const SET_FILTERED_DRUGS = 'SET_FILTERED_DRUGS';
export const CHANGE_DRUG_VIEW = 'CHANGE_DRUG_VIEW';
export const SET_DRUG_COUNTS = 'SET_DRUG_COUNTS';
export const SET_DRUG_FILTERS = 'SET_DRUG_FILTERS';
export const SET_DRUG_INFO = 'SET_DRUG_INFO';

/**
 * Action creator for setting filtered cell lines
 */
function setFilteredDrugs(drugs) {
  return {
    type: SET_FILTERED_DRUGS,
    drugs
  };
}

/**
 * Action creator for setting filtered cell lines
 */
function setDrugCounts(counts) {
  return {
    type: SET_DRUG_COUNTS,
    counts: counts
  };
}

/**
 * Action creator for setting drug info
 */
function setDrugInfo(info) {
  return {
    type: SET_DRUG_INFO,
    info
  };
}


/**
 * Helper function to determine if the
 * drugs need to be acquired.
 * Right now always returns true.
 * @return true
 */
function shouldFetchDrugs(state) {
  return true;
}

/**
 * Helper function to get cellines given a set of filterGroups
 * @return {Function}
 */
function fetchDrugs(filterGroups, allFilterGroups) {
  return dispatch => {
    api.getDrugs(filterGroups)
    .then((data) => {
      dispatch(setFilteredDrugs(data));
      return data;
    })
    //TODO: should this be split into 2 different action creators?
    .then(data => api.getDrugCounts(data, allFilterGroups))
    .then(counts => dispatch(setDrugCounts(counts)));
  };
}

/**
 * Helper function to get cellines given a set of filterGroups
 * @return {Function}
 */
function fetchDrugInfo(drugId) {
  return dispatch => {
    api.getDrugInfo(drugId)
    .then((data) => dispatch(setDrugInfo(data)));
  };
}

/**
 * Public function to acquire drug data
 * and create action to store it.
 */
export function fetchDrugsIfNeeded(activeFilterGroups, allFilterGroups) {
  return (dispatch, getState) => {
    if (shouldFetchDrugs(getState())) {
      return dispatch(fetchDrugs(activeFilterGroups, allFilterGroups));
    }
  };
}

/**
 * Helper function to determine if the
 * drugs need to be acquired.
 * Right now always returns true.
 * @return true
 */
function shouldFetchDrugInfo(state, drugId) {
  return true;
}

/**
 * Public function to acquire single drug info
 * and create action to store it.
 */
export function fetchDrugInfoIfNeeded(drugId) {
  return (dispatch, getState) => {
    if (shouldFetchDrugInfo(getState(), drugId)) {
      return dispatch(fetchDrugInfo(drugId));
    }
  };
}


/**
 * Action creator for changing the cell line view the table shows
 */
export function changeDrugView(drugView) {
  return {
    type: CHANGE_DRUG_VIEW,
    drugView
  };
}

/**
 * Action creator for setting drug filter definition and autocomplete values
 */
export function setDrugFilters(drugFilters) {
  return {
    type: SET_DRUG_FILTERS,
    drugFilters
  };
}

/**
 * Public function to get drug filter definition based on the drug data
 */
export function fetchDrugFilters() {
  return dispatch => {
    const drugFilters = api.getDrugFilters();
    return dispatch(setDrugFilters(drugFilters));
  };
}
