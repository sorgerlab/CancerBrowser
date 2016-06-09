import api from '../api';

export const CHANGE_DRUG_VIEW = 'CHANGE_DRUG_VIEW';
export const SET_DRUG_INFO = 'SET_DRUG_INFO';
export const REQUEST_DRUGS = 'REQUEST_DRUGS';
export const RECEIVE_DRUGS = 'RECEIVE_DRUGS';
export const DRUGS_CHANGE_ACTIVE_FILTERS = 'DRUGS_CHANGE_ACTIVE_FILTERS';
export const DRUGS_RESET_FILTERS = 'DRUGS_RESET_FILTERS';

/**
 * Action creator for setting drug info
 */
function setDrugInfo(info) {
  return {
    type: SET_DRUG_INFO,
    info
  };
}


function requestDrugs() {
  return {
    type: REQUEST_DRUGS
  };
}

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
 * Helper function to get drug info
 * @return {Function}
 */
function fetchDrugInfo(drugId) {
  return dispatch => {
    api.getDrugInfo(drugId)
    .then((data) => dispatch(setDrugInfo(data)));
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
