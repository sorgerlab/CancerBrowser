

import { CHANGE_HIGHLIGHT, CHANGE_ACTIVE_LEFT, CHANGE_ACTIVE_RIGHT } from '../actions/receptor_profile';

const INITIAL_STATE = {
  highlight: undefined,
  activeLeft: undefined,
  activeRight: undefined
};

function receptorProfile(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_HIGHLIGHT:
      return Object.assign({}, state, {
        highlight: action.highlightId
      });
    case CHANGE_ACTIVE_LEFT:
      return Object.assign({}, state, {
        activeLeft: action.activeId
      });
    case CHANGE_ACTIVE_RIGHT:
      return Object.assign({}, state, {
        activeRight: action.activeId
      });
    default:
      return state;
  }
}

export default receptorProfile;
