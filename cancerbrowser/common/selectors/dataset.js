import _ from 'lodash';

///////////////////////////
// Shared Input Selectors
///////////////////////////

/**
 * Returns a dataset from the store using `datasets.datasetsById`
 * This function is curried and is often used as an input selector
 * as `getDataset(myDatasetId)`
 *
 * @param {String} datasetId The dataset ID
 * @param {Object} The redux store state
 * @return {Array} The dataset items
 */
export const getDataset = _.curry(function (datasetId, state) {
  const dataset = state.datasets.datasetsById[datasetId];
  return dataset && dataset.items;
});

/**
 * Returns the `viewBy` property of a dataset page based on a datasetKey
 * This function is curried and is often used as an input selector
 * as `getViewBy(myDatasetKey)`
 *
 * @param {String} datasetKey The dataset key (i.e., the object key in
    `store.datasets` for this dataset)
 * @param {Object} The redux store state
 * @return {String} The view by property value
 */
export const getViewBy = _.curry(function (datasetKey, state) {
  return state.datasets[datasetKey].viewBy;
});
