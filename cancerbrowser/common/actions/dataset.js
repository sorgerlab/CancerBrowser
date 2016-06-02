import api from '../api';


export const REQUEST_DATASETS_INFO = 'REQUEST_DATASETS_INFO';
export const RECEIVE_DATASETS_INFO = 'RECEIVE_DATASETS_INFO';

export const REQUEST_DATASET = 'REQUEST_DATASET';
export const RECEIVE_DATASET = 'RECEIVE_DATASET';

// Action Creators
function requestDatasetsInfo() {
  return {
    type: REQUEST_DATASETS_INFO
  };
}

function receiveDatasetsInfo(datasets) {
  return {
    type: RECEIVE_DATASETS_INFO,
    datasets: datasets
  };
}

function requestDataset(datasetId) {
  return {
    type: REQUEST_DATASET,
    datasetId
  };
}

function receiveDataset(datasetId, dataset) {
  return {
    type: RECEIVE_DATASET,
    datasetId,
    dataset: dataset
  };
}

// Helpers
export function fetchDatasetsInfo() {
  return dispatch => {
    dispatch(requestDatasetsInfo());
    api.getDatasetsInfo().then(
      data => dispatch(receiveDatasetsInfo(data))
    );
  };
}



function fetchDataset(datasetId) {
  return dispatch => {
    dispatch(requestDataset(datasetId));
    api.getDataset(datasetId).then(
      data => dispatch(receiveDataset(datasetId, data))
    );
  };
}

function shouldFetchDataset(state, datasetId) {

  const { datasetsById } = state.datasets;

  // If there are no datasetDetails at all
  if (!datasetsById) {
    return true;
  }

  // If this particular datasetDetail does not exist
  if (!datasetsById.hasOwnProperty(datasetId)) {
    return true;
  }

  const dataset = datasetsById[datasetId];

  // If this dataset is already fetching
  if (dataset.isFetching) {
    return false;
  }

  // If the dataset exists, but is not populated
  if (!dataset.items) {
    return true;
  }

  return false;
}

export function fetchDatasetInfo(datasetId) {
  // currently this can just fetch all dataset info
  return fetchDatasetsInfo();
}

export function fetchDatasetIfNeeded(datasetId) {
  return (dispatch, getState) => {
    if (shouldFetchDataset(getState(), datasetId)) {
      return dispatch(fetchDataset(datasetId));
    }
  };
}
