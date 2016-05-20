import { REQUEST_CELLS_IN_DATASETS, RECEIVE_CELLS_IN_DATASETS } from '../actions';

const INITIAL_STATE = {
  isFetching: false
};

function cellsInDatasets(state = INITIAL_STATE, action) {
  switch (action.type) {
    case REQUEST_CELLS_IN_DATASETS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_CELLS_IN_DATASETS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.cellsInDatasets
      });
    default:
      return state;
  }
}

export default cellsInDatasets;
