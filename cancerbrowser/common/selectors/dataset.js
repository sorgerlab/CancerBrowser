import _ from 'lodash';

///////////////////////////
// Shared Input Selectors
///////////////////////////

export const getDataset = _.curry(function (datasetId, state) {
  const dataset = state.datasets.datasetsById[datasetId];
  return dataset && dataset.items;
});

export const getViewBy = _.curry(function (datasetKey, state) {
  return state.datasets[datasetKey].viewBy;
});

export function getFilteredCellLines(state) {
  return state.cellLines.filtered;
}
