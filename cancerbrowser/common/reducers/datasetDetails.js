import { REQUEST_DATASET_DETAIL, RECEIVE_DATASET_DETAIL, RECEIVE_DATASET_INFO } from '../actions/dataset';

const INITIAL_STATE = {
  isFetching: false
};

// TODO Condense these into one.
function datasetDetail(state = INITIAL_STATE, action) {
  switch (action.type) {
    case REQUEST_DATASET_DETAIL:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_DATASET_DETAIL:
      return Object.assign({}, state, {
        isFetching: false,
        item: action.datasetDetail
      });
    default:
      return state;
  }
}

function datasetDetails(state = {datasetInfo: {}}, action) {
  // State is datasetDetails
  switch (action.type) {
    case RECEIVE_DATASET_DETAIL:
    case REQUEST_DATASET_DETAIL:
      return Object.assign({}, state, {
        [action.datasetId]: datasetDetail(state[action.datasetId], action)
      });
    case RECEIVE_DATASET_INFO:
      return Object.assign({}, state, {
        datasetInfo: action.datasetInfo
      });

    default:
      return state;
  }
}

export default datasetDetails;
