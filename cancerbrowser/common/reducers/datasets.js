import { REQUEST_DATASETS, RECEIVE_DATASETS } from '../actions/dataset';

const INITIAL_STATE = {
  isFetching: false,
  items: {}
};


function datasets(state = INITIAL_STATE, action) {
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
