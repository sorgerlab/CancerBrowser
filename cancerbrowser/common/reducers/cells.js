import { REQUEST_CELLS, RECEIVE_CELLS } from '../actions';

function cells(state = {
  isFetching: false
}, action) {
  switch (action.type) {
    case REQUEST_CELLS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_CELLS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.cells,
        subtypes: action.subtypes
      });
    default:
      return state;
  }
}

export default cells;
