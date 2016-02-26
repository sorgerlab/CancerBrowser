import { REQUEST_DATASETS, RECEIVE_DATASETS } from '../actions';

function datasets(state = {
  isFetching: false,
}, action) {
  switch (action.type) {
    case REQUEST_DATASETS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_DATASETS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.datasets
      });
    default:
      return state;
  }
}

export default datasets;
