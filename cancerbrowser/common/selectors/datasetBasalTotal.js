import { createSelector } from 'reselect';
import _ from 'lodash';
import { getDataset } from './dataset';
import { getFilterValues } from '../utils/filter_utils';

const datasetId = 'basal_total';
const datasetKey = 'datasetBasalTotal';


/////////////////////
// Input Selectors
/////////////////////

/**
 * An input selector for getting the active cell line
 *
 * @param {Object} The redux state
 * @return {String} The ID of the active cell line
 */
function getActiveCellLines(state) {
  const activeFilters = state.datasets[datasetKey].activeFilters;
  return getFilterValues(activeFilters, 'basalTotal', 'cellLine');
}


/////////////////////
// Helpers
/////////////////////

/**
 * Filter the data based on a set of cell lines
 *
 * @param {Array} data the data to filter
 * @param {Array} cellLines the list of cell lines to filter the data by
 * @return {Array} A subset of `data` that contains only cell lines in `cellLines`
 */
function filterDataByCellLines(data, cellLines) {
  if (!data) {
    return data;
  }
  if (!cellLines) {
    return data;
  }

  const nData =  data.map((row) => {
    const nRow = _.clone(row);
    nRow.measurements = nRow.measurements.filter((m) =>  cellLines.includes(m.id));
    return nRow;
  });

  return nData;
}


/////////////////////
// Selectors
/////////////////////


/**
 * A selector that filters the dataset to match the selected cell lines
 *
 * Input selectors:
 *   - getDataset
 *   - getActiveCellLines
 *
 * @return {Array} The filtered dataset
 */
export const getFilteredViewData = createSelector(
  [ getDataset(datasetId), getActiveCellLines ],
  (dataset, activeCellLines) => {
    return filterDataByCellLines(dataset, activeCellLines);
  }
);



/**
 * A selector that creates the filter groups based on what values are in the
 * data. Note that this does not use the filtered data since we need all the
 * potential values.
 *
 * Input selectors:
 *   - getDataset
 *
 * @return {Array} The filter groups definition
 */
export const getFilterGroups = createSelector(
  [ getDataset(datasetId) ],
  (dataset) => {
    const filterGroups = [];

    let cellLines = [];

    if(dataset) {
      cellLines = _.map(dataset[0].measurements, (d) => { return {value:d.id, label:d.label}; });
    }
    const basalPhospho = [
      {
        id: 'cellLine',
        label: 'Cell Line',
        type: 'multi-select',
        values: cellLines,
        options: {
          props: { counts: null }
        }
      }
    ];

    filterGroups.push({
      id: 'basalTotal',
      label: 'Configure',
      clearable: true,
      filters: basalPhospho
    });

    return filterGroups;
  }
);
