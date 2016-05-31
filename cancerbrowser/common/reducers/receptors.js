import { REQUEST_RECEPTORS, SET_RECEPTORS } from '../actions/receptor';

const INITIAL_STATE = {
  isFetching: false,
  items: []
};


function receptors(state = INITIAL_STATE, action) {
  switch (action.type) {
    case REQUEST_RECEPTORS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case SET_RECEPTORS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.receptors
      });
    default:
      return state;
  }
}

export default receptors;
