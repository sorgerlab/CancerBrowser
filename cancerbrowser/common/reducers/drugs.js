
import {
  DRUGS_CHANGE_ACTIVE_FILTERS,
  DRUGS_RESET_FILTERS,
  CHANGE_DRUG_VIEW,
  REQUEST_DRUGS,
  RECEIVE_DRUGS } from '../actions/drug';

const INITIAL_STATE = {
  isFetching: false,
  items: [],

  activeFilters: {},
  info: {}
};

function drugs(state = INITIAL_STATE, action) {
  switch (action.type) {
    case DRUGS_CHANGE_ACTIVE_FILTERS:
      return Object.assign({}, state, {
        activeFilters: action.activeFilters
      });

    case DRUGS_RESET_FILTERS:
      return Object.assign({}, state, {
        activeFilters: INITIAL_STATE.activeFilters
      });

    case REQUEST_DRUGS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_DRUGS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.drugs
      });

    case CHANGE_DRUG_VIEW:
      return Object.assign({}, state, {
        drugView: action.drugView
      });

    default:
      return state;
  }
}

export default drugs;
