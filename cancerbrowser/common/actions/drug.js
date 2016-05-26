import api from '../api';

export const SET_FILTERED_DRUGS = 'SET_FILTERED_DRUGS';
export const CHANGE_DRUG_VIEW = 'CHANGE_DRUG_VIEW';
export const SET_DRUG_COUNTS = 'SET_DRUG_COUNTS';

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
 * Public function to acquire cell line data
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
 * Action creator for changing the cell line view the table shows
 */
export function changeDrugView(drugView) {
  return {
    type: CHANGE_DRUG_VIEW,
    drugView
  };
}
