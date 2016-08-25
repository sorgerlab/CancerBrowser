import api from '../api';


export const REQUEST_DATASETS_INFO = 'REQUEST_DATASETS_INFO';
export const RECEIVE_DATASETS_INFO = 'RECEIVE_DATASETS_INFO';

export const REQUEST_DATASET = 'REQUEST_DATASET';
export const RECEIVE_DATASET = 'RECEIVE_DATASET';

// Action Creators

/**
 * Action creator to indicate dataset info has been requested
 */
function requestDatasets() {
  return {
    type: REQUEST_DATASETS_INFO
  };
}

/**
 * Action creator for setting datasets info
 * @param {Array} datasets All Datasets info
 */
function receiveDatasets(datasets) {
  return {
    type: RECEIVE_DATASETS_INFO,
    datasets: datasets
  };
}

/**
 * Action creator for indicating dataset data has been requested
 * @param {String} datasetId Id of the dataset
 */
function requestDataset(datasetId) {
  return {
    type: REQUEST_DATASET,
    datasetId
  };
}

/**
 * Action creator for setting particular dataset data
 * @param {String} datasetId Id of the dataset
 * @param {Object} dataset New dataset data
 */
function receiveDataset(datasetId, dataset) {
  return {
    type: RECEIVE_DATASET,
    datasetId,
    dataset: dataset
  };
}

// Helpers

function fetchDatasetsInfo() {
  return dispatch => {
    dispatch(requestDatasets());
    api.getDatasets().then(
      data => dispatch(receiveDatasets(data))
    );
  };
}

/**
 * Helper function to determine if a datasets info
 * needs to be fetched from the API.
 * @param {Object} state current state
 * @return {Boolean}
 */
function shouldFetchDatasetsInfo(state) {

  const datasetsInfo = state.datasets.info;

  if (Object.keys(datasetsInfo.items).length > 0) {
    return false;
  }

  // If this is already fetching
  if (datasetsInfo.isFetching) {
    return false;
  }

  return true;
}

/**
 * Function to get datasets info if needed
 * @return {Function}
 */
export function fetchDatasetsInfoIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchDatasetsInfo(getState())) {
      return dispatch(fetchDatasetsInfo());
    }
  };
}

/**
 * Helper function to get dataset data for a particular dataset
 * @param {String} datasetId
 * @return {Function}
 */
function fetchDataset(datasetId) {
  return dispatch => {
    dispatch(requestDataset(datasetId));
    api.getDataset(datasetId).then(
      data => dispatch(receiveDataset(datasetId, data))
    );
  };
}

/**
 * Helper function to determine if a particular
 * dataset needs to be fetched from the API.
 * @param {Object} state current state
 * @param {String} datasetId id to check
 * @return {Boolean}
 */
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

/**
 * Function to get dataset data for a particular dataset if needed
 * @param {String} datasetId
 * @return {Function}
 */
export function fetchDatasetIfNeeded(datasetId) {
  return (dispatch, getState) => {
    if (shouldFetchDataset(getState(), datasetId)) {
      return dispatch(fetchDataset(datasetId));
    }
  };
}
