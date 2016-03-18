import { REQUEST_DATASET_DETAIL, RECEIVE_DATASET_DETAIL } from '../actions';

// TODO Condense these into one.

function datasetDetail(state = {
  // State is datasetDetails[datasetId]
  isFetching: false
}, action) {
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

function datasetDetails(state = {
}, action) {
  // State is datasetDetails
  switch (action.type) {
    case RECEIVE_DATASET_DETAIL:
    case REQUEST_DATASET_DETAIL:
      return Object.assign({}, state, {
        [action.datasetId]: datasetDetail(state[action.datasetId], action)
      });
    default:
      return state
  }
}

export default datasetDetails;
