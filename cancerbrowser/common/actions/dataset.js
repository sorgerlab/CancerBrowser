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

// /**
//  * Action creator for indicating dataset data has been requested
//  * @param {String} datasetId Id of the dataset
//  */
// function requestDataset(datasetId) {
//   return {
//     type: REQUEST_DATASET,
//     datasetId
//   };
// }

// /**
//  * Action creator for setting particular dataset data
//  * @param {String} datasetId Id of the dataset
//  * @param {Object} dataset New dataset data
//  */
// function receiveDataset(datasetId, dataset) {
//   return {
//     type: RECEIVE_DATASET,
//     datasetId,
//     dataset: dataset
//   };
// }

// Helpers

export function fetchDatasets() {
  return dispatch => {
    dispatch(requestDatasets());
    api.getDatasets().then(
      data => dispatch(receiveDatasets(data))
    );
  };
}


// /**
//  * Helper function to get dataset data for a particular dataset
//  * @param {String} datasetId
//  * @return {Function}
//  */
// function fetchDataset(datasetId) {
//   return dispatch => {
//     dispatch(requestDataset(datasetId));
//     api.getDataset(datasetId).then(
//       data => dispatch(receiveDataset(datasetId, data))
//     );
//   };
// }

// /**
//  * Helper function to determine if a particular
//  * dataset needs to be fetched from the API.
//  * @param {Object} state current state
//  * @param {String} datasetId id to check
//  * @return {Boolean}
//  */
// function shouldFetchDataset(state, datasetId) {
//
//   const { datasetsById } = state.datasets;
//
//   // If there are no datasetDetails at all
//   if (!datasetsById) {
//     return true;
//   }
//
//   // If this particular datasetDetail does not exist
//   if (!datasetsById.hasOwnProperty(datasetId)) {
//     return true;
//   }
//
//   const dataset = datasetsById[datasetId];
//
//   // If this dataset is already fetching
//   if (dataset.isFetching) {
//     return false;
//   }
//
//   // If the dataset exists, but is not populated
//   if (!dataset.items) {
//     return true;
//   }
//
//   return false;
// }

// /**
//  * Helper function to get dataset info for a particular dataset
//  * @param {String} datasetId
//  * @return {Function}
//  */
// export function fetchDatasetInfo(datasetId) {
//   // currently this can just fetch all dataset info
//   return fetchDatasetsInfo();
// }

// /**
//  * Function to get dataset data for a particular dataset if needed
//  * @param {String} datasetId
//  * @return {Function}
//  */
// export function fetchDatasetIfNeeded(datasetId) {
//   return (dispatch, getState) => {
//     if (shouldFetchDataset(getState(), datasetId)) {
//       return dispatch(fetchDataset(datasetId));
//     }
//   };
// }
