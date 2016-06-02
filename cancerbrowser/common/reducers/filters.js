

import { CHANGE_ACTIVE_FILTERS, RESET_ACTIVE_FILTERS } from '../actions/filter';

const INITIAL_STATE = {
  active: {},
  isFetching: false
};

function filters(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_ACTIVE_FILTERS:
      return Object.assign({}, state, {
        isFetching: false,
        active: action.activeFilters
      });
    case RESET_ACTIVE_FILTERS:
      return INITIAL_STATE;
    default:
      return state;
  }
}

export default filters;
