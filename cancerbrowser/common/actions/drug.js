import api from '../api';

export const CHANGE_DRUG_VIEW = 'CHANGE_DRUG_VIEW';
export const REQUEST_DRUGS = 'REQUEST_DRUGS';
export const RECEIVE_DRUGS = 'RECEIVE_DRUGS';
export const DRUGS_CHANGE_ACTIVE_FILTERS = 'DRUGS_CHANGE_ACTIVE_FILTERS';
export const DRUGS_RESET_FILTERS = 'DRUGS_RESET_FILTERS';

/**
 * Action creator for indicating drug data has been
 * requested
 */
function requestDrugs() {
  return {
    type: REQUEST_DRUGS
  };
}

/**
 * Action creator for indicating drug data has been
 * set
 * @param {Array} drugs Drugs dataset
 */
function receiveDrugs(drugs) {
  return {
    type: RECEIVE_DRUGS,
    drugs
  };
}


/**
 * Helper function to determine if the
 * drugs need to be acquired.
 * @return {Boolean}
 */
function shouldFetchDrugs(state) {
  const { drugs } = state;

  // no drugs state defined
  if (!drugs) {
    return true;
  }

  // If this drugs are already being fetched
  if (drugs.isFetching) {
    return false;
  }

  // If drugs state exists, but is not populated
  if (!drugs.items || !drugs.items.length) {
    return true;
  }

  return false;
}

/**
 * Helper function to get drugs
 * @return {Function}
 */
function fetchDrugs() {
  return dispatch => {
    dispatch(requestDrugs());
    api.getDrugs().then((data) => {
      dispatch(receiveDrugs(data));
      return data;
    });
  };
}

/**
 * Public function to acquire drug data
 * and create action to store it.
 */
export function fetchDrugsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchDrugs(getState())) {
      return dispatch(fetchDrugs());
    }
  };
}

/**
 * Action creator for changing the drug view the table shows
 */
export function changeDrugView(drugView) {
  return {
    type: CHANGE_DRUG_VIEW,
    drugView
  };
}

/**
 * Action creator changing the active filters
 */
export function changeActiveFilters(activeFilters) {
  return {
    type: DRUGS_CHANGE_ACTIVE_FILTERS,
    activeFilters
  };
}

/**
 * Action creator for resetting active filtesr
 */
export function resetActiveFilters() {
  return {
    type: DRUGS_RESET_FILTERS
  };
}
