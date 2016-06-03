import { createSelector } from 'reselect';
import _ from 'lodash';

const datasetId = 'receptor_profile';

/////////////////////
// Input Selectors
/////////////////////
const getDataset = (state) => {
  const dataset = state.datasets.datasetsById[datasetId];
  return dataset && dataset.items;
};

const getViewBy = state => state.datasets.datasetReceptorProfile.viewBy;

const getFilteredCellLines = state => state.cellLines.filtered;


/////////////////////
// Helpers
/////////////////////

/**
 * Filter the data based on a set of cell lines
 */
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
      if(newMeasurement.value === newMeasurement.threshold) {
        newMeasurement.disabled = true;
      }
      receptors[m.id].measurements.push(newMeasurement);
    });
  });

  return _.values(receptors);
}


/** Filters data organized by receptor based on provided cell lines */
function filterReceptorDataByCellLine(data, cellLines) {
  if (!data) {
    return data;
  }

  return data.map(d => {
    const filteredMeasurements = d.measurements.filter(m => {
      return cellLines.find(cellLine => cellLine.id === m.id);
    });

    return Object.assign({}, d, { measurements: filteredMeasurements });
  });
}

/////////////////////
// Selectors
/////////////////////

/** Converts the dataset to be by cell line or by receptor */
export const getViewData = createSelector(
  [ getDataset, getViewBy ],
  (dataset, viewBy) => {
    if (viewBy === 'receptor') {
      return convertToByReceptor(dataset);
    } else {
      return dataset;
    }
  }
);


/** Filters the dataset */
export const getFilteredViewData = createSelector(
  [ getViewData, getViewBy, getFilteredCellLines ],
  (viewData, viewBy, filteredCellLines) => {
    if (viewBy === 'receptor') {
      return filterReceptorDataByCellLine(viewData, filteredCellLines);
    } else {
      return filterDataByCellLines(viewData, filteredCellLines);
    }
  }
);
