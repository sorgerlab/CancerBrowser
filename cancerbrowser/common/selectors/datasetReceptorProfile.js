import { createSelector } from 'reselect';
import _ from 'lodash';
import { getDataset, getViewBy } from './dataset';
import { cellLinesFilterGroup, getFilteredCellLines } from './cell_line';

const datasetId = 'receptor_profile';
const datasetKey = 'datasetReceptorProfile';


/////////////////////
// Input Selectors
/////////////////////


/////////////////////
// Helpers
/////////////////////

/**
 * Transform Receptor data to be oriented by receptor instead of
 * cell line data.
 * @param {Array} dataset Dataset expected to be processed by
 * transformReceptorData already (in api dataset code).
*
 * @return {Array}
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
      receptors[m.id]  = receptors[m.id] || {id:m.id, label:m.receptor, measurements: [], metric: m.metric};
      // add a new cell line based measurement
      let newMeasurement = {id: cellLine.id, label: cellLine.label, value:m.value, threshold:m.threshold};
      if(newMeasurement.value === newMeasurement.threshold) {
        newMeasurement.disabled = true;
      }
      newMeasurement['cell_line'] = cellLine['cell_line'];
      receptors[m.id].measurements.push(newMeasurement);
    });
  });

  return _.values(receptors);
}


/**
 * Filter the receptor data based on a set of cell lines
 *
 * @param {Array} data the data to filter
 * @param {Array} cellLines the list of cell lines to filter the data by
 * @return {Array} A subset of `data` that contains only cell lines in `cellLines`
 */
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

/**
 * For 1 cell line x all receptors view, we don't want to display AU
 * values - so filter them.
 *
 * @param {Array} dataset The 1 cell line x all recetors dataset
 * @param {String} metricToKeep the metric type to keep
 * @return {Array} A subset of dataset
 */
function filterByMetric(dataset, metricToKeep) {
  if (!dataset) {
    return dataset;
  }

  const newData = dataset.map(function(cellLine) {
    const newCellLine = _.cloneDeep(cellLine);
    newCellLine.measurements = newCellLine.measurements.filter((m) => m.metric === metricToKeep);
    return newCellLine;
  });

  return newData;
}

/////////////////////
// Selectors
/////////////////////

/**
 * A selector that returns the data organized by receptor or by cell line
 * depending on the view by.
 *
 * Input selectors:
 *   - getDataset
 *   - getViewBy
 *
 * @return {Array} The dataset for the current view
 */
export const getViewData = createSelector(
  [ getDataset(datasetId), getViewBy(datasetKey) ],
  (dataset, viewBy) => {
    if (viewBy === 'receptor') {
      return convertToByReceptor(dataset);
    } else {
      return filterByMetric(dataset, 'pg/cell');
    }
  }
);


/**
 * A selector that filters the dataset to match the configuration
 * of the page (filtered cell lines)
 *
 * Input selectors:
 *   - getViewData (a selector)
 *   - getViewBy
 *   - getFilteredCellLines
 *
 * @return {Array} The filtered dataset
 */
export const getFilteredViewData = createSelector(
  [ getViewData, getViewBy(datasetKey), getFilteredCellLines ],
  (viewData, viewBy, filteredCellLines) => {
    if (viewBy === 'receptor') {
      return filterReceptorDataByCellLine(viewData, filteredCellLines);
    } else {
      return viewData;
    }
  }
);


/**
 * A selector that creates the filter groups based on what values are in the
 * data. Note that this does not use the filtered data since we need all the
 * potential values.
 *
 * Input selectors:
 *   - getViewData
 *   - getViewBy
 * @return {Array} The filter groups definition
 */
export const getFilterGroups = createSelector(
  [ getViewData, getViewBy(datasetKey) ],
  (viewData, viewBy) => {
    const filterGroups = [];


    // VIEW BY: receptor
    // ------------------------------------
    if (viewBy === 'receptor') {
      // read the list of receptors from the data
      let receptors;
      if (viewData) {
        receptors = _.sortBy(viewData.map(d => ({ value: d.id, label: d.label })), 'label');
      } else {
        receptors = [];
      }

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
        clearable: false,
        filters: byReceptorConfig
      });

      // remove the dataset from the cell lines group
      filterGroups.push({
        id: cellLinesFilterGroup.id,
        label: cellLinesFilterGroup.label,
        filters: cellLinesFilterGroup.filters.filter(filter => filter.id !== 'dataset')
      });


    // VIEW BY: cell line
    // ------------------------------------
    } else {
      let cellLines;
      if(viewData) {
        cellLines = _.map(viewData,(d) => { return {value:d.id, label:d.label}; });
      } else {
        cellLines = [];
      }

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
        clearable: false,
        filters: byCellLineConfig
      });
    }

    return filterGroups;
  }
);
