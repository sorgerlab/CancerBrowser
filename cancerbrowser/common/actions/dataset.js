import api from '../api';


export const REQUEST_DATASETS = 'REQUEST_DATASETS';
export const RECEIVE_DATASETS = 'RECEIVE_DATASETS';
export const RECEIVE_DATASET_INFO = 'RECEIVE_DATASET_INFO';

export const REQUEST_DATASET_DETAIL = 'REQUEST_DATASET_DETAIL';
export const RECEIVE_DATASET_DETAIL = 'RECEIVE_DATASET_DETAIL';

// Action Creators
function requestDatasets() {
  return {
    type: REQUEST_DATASETS
  };
}

function receiveDatasets(datasets) {
  return {
    type: RECEIVE_DATASETS,
    datasets: datasets
  };
}

function requestDatasetDetail(datasetId) {
  return {
    type: REQUEST_DATASET_DETAIL,
    datasetId
  };
}

function receiveDatasetInfo(datasetInfo) {
  return {
    type: RECEIVE_DATASET_INFO,
    datasetInfo: datasetInfo
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
      data => dispatch(receiveDatasets(data))
    );
  };
}



function fetchDatasetDetail(datasetId, format) {
  return dispatch => {
    dispatch(requestDatasetDetail(datasetId));
    api.getDataset(datasetId, format).then(
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

export function fetchDatasetInfo({ datasetId }) {
  return dispatch => {
    dispatch(requestDatasets());
    api.getDatasetInfo(datasetId).then(
      data => dispatch(receiveDatasetInfo(data))
    );
  };
}

export function fetchDatasetDetailIfNeeded(datasetId, format ) {
  return (dispatch, getState) => {
    if (shouldFetchDatasetDetail(getState(), datasetId)) {
      return dispatch(fetchDatasetDetail(datasetId, format));
    }
  };
}
