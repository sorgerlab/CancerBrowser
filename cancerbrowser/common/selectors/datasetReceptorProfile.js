import { createSelector } from 'reselect';
import _ from 'lodash';
import { getDataset, getViewBy, getFilteredCellLines } from './dataset';
import { cellLineFilters } from '../containers/CellLineBrowserPage';

const datasetId = 'receptor_profile';
const datasetKey = 'datasetReceptorProfile';


/////////////////////
// Input Selectors
/////////////////////
function getReceptors(state) {
  return state.receptors.items;
}


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
  [ getDataset(datasetId), getViewBy(datasetKey) ],
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
  [ getViewData, getViewBy(datasetKey), getFilteredCellLines ],
  (viewData, viewBy, filteredCellLines) => {
    if (viewBy === 'receptor') {
      return filterReceptorDataByCellLine(viewData, filteredCellLines);
    } else {
      return filterDataByCellLines(viewData, filteredCellLines);
    }
  }
);


/** Gets the filter group definition based on what is in the data */
export const getFilterGroups = createSelector(
  [ getViewData, getViewBy(datasetKey), getReceptors ],
  (viewData, viewBy, receptors) => {
    const filterGroups = [];

    if (viewBy === 'receptor') {
      const byReceptorConfig = [
        {
          id: 'receptor',
          label: 'Receptor',
          type: 'select',
          values: receptors,
          options: {
            props: { counts: null }
          }
        },
        {
          id: 'compareTo',
          label: 'Compare to',
          type: 'select',
          values: receptors,
          options: {
            props: { counts: null }
          }
        }
      ];

      filterGroups.push({
        id: 'byReceptorConfig',
        label: 'Configure',
        filters: byReceptorConfig
      });

      filterGroups.push({
        id: 'cellLineFilters',
        label: 'Cell Line Filters',
        filters: cellLineFilters.filter(filter => filter.id !== 'dataset')
      });
    } else {
      const cellLines = []; // TODO get all cell lines via an input selector
      // put by cell line filters here
      const byCellLineConfig = [
        {
          id: 'cellLine',
          label: 'Cell Line',
          type: 'select',
          values: cellLines,
          options: {
            props: { counts: null }
          }
        },
        {
          id: 'compareTo',
          label: 'Compare to',
          type: 'select',
          values: cellLines,
          options: {
            props: { counts: null }
          }
        }
      ];

      filterGroups.push({
        id: 'byCellLineConfig',
        label: 'Configure',
        filters: byCellLineConfig
      });
    }

    return filterGroups;
  }
);
