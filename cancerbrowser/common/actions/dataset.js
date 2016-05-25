import api from '../api';


export const REQUEST_DATASETS = 'REQUEST_DATASETS';
export const RECEIVE_DATASETS = 'RECEIVE_DATASETS';
export const REQUEST_DATASET_DETAIL = 'REQUEST_DATASET_DETAIL';
export const RECEIVE_DATASET_DETAIL = 'RECEIVE_DATASET_DETAIL';

// Action Creators
function requestDatasets() {
  return {
    type: REQUEST_DATASETS
  };
}

function receiveDatasets(json) {
  return {
    type: RECEIVE_DATASETS,
    datasets: json.datasets
  };
}

function requestDatasetDetail(datasetId) {
  return {
    type: REQUEST_DATASET_DETAIL,
    datasetId
  };
}

function receiveDatasetDetail(datasetId, datasetDetail) {
  return {
    type: RECEIVE_DATASET_DETAIL,
    datasetId,
    datasetDetail: datasetDetail
  };
}

// Helpers
export function fetchDatasets() {
  return dispatch => {
    dispatch(requestDatasets());
    api.getDatasets().then(
      json => dispatch(receiveDatasets(json))
    );
  };
}


function fetchDatasetDetail(datasetId) {
  return dispatch => {
    dispatch(requestDatasetDetail(datasetId));
    api.getDataset(datasetId).then(
      data => dispatch(receiveDatasetDetail(datasetId, data))
    );
  };
}

function shouldFetchDatasetDetail(state, datasetId) {

  const { datasetDetails } = state;

  // If there are no datasetDetails at all
  if (!datasetDetails) {
    return true;
  }

  // If this particular datasetDetail does not exist
  if (!datasetDetails.hasOwnProperty(datasetId)) {
    return true;
  }

  const datasetDetail = state.datasetDetails[datasetId];

  // If this datasetDetail is already fetching
  if (datasetDetail.isFetching) {
    return false;
  }

  // If the datasetDetail exists, but is not populated
  if (!datasetDetail.item) {
    return true;
  }

  return false;
}


// Action Creators (Functions when using thunk)

export function fetchDatasetDetailIfNeeded({ datasetId }) {
  return (dispatch, getState) => {
    if (shouldFetchDatasetDetail(getState(), datasetId)) {
      return dispatch(fetchDatasetDetail(datasetId));
    }
  };
}
