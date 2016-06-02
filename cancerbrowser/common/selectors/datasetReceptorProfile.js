import { createSelector } from 'reselect';
import _ from 'lodash';

const datasetId = 'receptor_profile';

const getDataset = (state) => {
  const dataset = state.datasets.datasetsById[datasetId];
  return dataset && dataset.items;
};

const getViewBy = state => state.datasets.datasetReceptorProfile.viewBy;

const getFilteredCellLines = state => state.cellLines.filtered;

function filterDataByCellLines(data, cellLines) {
  if (!data) {
    return data;
  }

  return data.filter(d => cellLines.find(cellLine => cellLine.id === d.cell_line.id));
}


/**
 * Transform Receptor data to be oriented by receptor instead of
 * cell line data.
 * @param {Array} dataset Dataset expected to be processed by
 * transformReceptorData already.
 *
 */
function convertToByReceptor(dataset) {
  if (!dataset) {
    return dataset;
  }

  // Store each receptor found separately.
  let receptors = {};

  dataset.forEach(function(cellLine) {

    // iterate over receptor data
    cellLine.measurements.forEach(function(m) {
      // pull out receptor if it isn't in the receptors hash already.
      receptors[m.id]  = receptors[m.id] || {id:m.id, label:m.receptor, measurements: []};
      // add a new cell line based measurement
      let newMeasurement = {id: cellLine.id, label: cellLine.label, value:m.value, threshold:m.threshold};
      receptors[m.id].measurements.push(newMeasurement);
    });
  });

  return _.values(receptors);
}


export const getViewData = createSelector(
  [ getDataset, getViewBy, getFilteredCellLines ],
  (dataset, viewBy, filteredCellLines) => {
    if (viewBy === 'receptor') {
      return convertToByReceptor(dataset);
    } else {
      return filterDataByCellLines(dataset, filteredCellLines);
    }
  }
);

