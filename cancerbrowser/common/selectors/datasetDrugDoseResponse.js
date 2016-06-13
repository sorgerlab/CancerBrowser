import { createSelector } from 'reselect';
import _ from 'lodash';
import { getDataset, getViewBy } from './dataset';
import { cellLinesFilterGroup, getFilteredCellLines } from './cell_line';
import { getFilterValue } from '../utils/filter_utils';

const datasetId = 'drug_dose_response';
const datasetKey = 'datasetDrugDoseResponse';

/////////////////////
// Input Selectors
/////////////////////


/**
 * An input selector for getting the active drug
 *
 * @param {Object} The redux state
 * @return {String} The ID of the active drug
 */
function getActiveDrug(state) {
  const activeFilters = state.datasets[datasetKey].activeFilters;
  return getFilterValue(activeFilters, 'drugConfig', 'drug');
}


/**
 * An input selector for getting the active cell line
 *
 * @param {Object} The redux state
 * @return {String} The ID of the active cell line
 */
function getActiveCellLine(state) {
  const activeFilters = state.datasets[datasetKey].activeFilters;
  return getFilterValue(activeFilters, 'cellLineConfig', 'cellLine');
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

  return data.filter(d => cellLines.find(cellLine => cellLine.id === d.cell_line.id));
}

/////////////////////
// Selectors
/////////////////////

/**
 * A selector that filters the dataset to match the selected cell lines and
 * the active drug / cell line.
 *
 * Input selectors:
 *   - getDataset
 *   - getViewBy
 *   - getActiveDrug
 *   - getActiveCellLine
 *   - getFilteredCellLines
 *
 * @return {Array} The filtered dataset
 */
export const getFilteredViewData = createSelector(
  [ getDataset(datasetId), getViewBy(datasetKey),
    getActiveDrug, getActiveCellLine,
    getFilteredCellLines ],
  (dataset, viewBy, activeDrug, activeCellLine, filteredCellLines) => {
    if (!dataset) {
      return dataset;
    }

    // use different ID keys and values depending on the view type.
    const datasetFilteredByCellLines = filterDataByCellLines(dataset, filteredCellLines);
    let idFilterKey, idFilterValue;

    // by drug, use drug ID
    if (viewBy === 'drug') {
      idFilterKey = 'small_molecule_HMSLID';
      idFilterValue = activeDrug;

    // by cell line, use cell line ID
    } else {
      idFilterKey = 'id';
      idFilterValue = activeCellLine;
    }

    // Note that this data does include Infinity and -Infinity in GR50.
    const filteredData = datasetFilteredByCellLines.filter(d => d[idFilterKey] === idFilterValue);

    return filteredData;
  }
);

/**
 * A selector that derives the waterfall plot data, grouped by
 * plotted variables: gr50, grMax
 *
 * Input selectors:
 *   - getFilteredViewData (a selector)
 *   - getViewBy
 *
 * @return {Object} The plot data `{ gr50: [], grMax: [] }`
 */
export const getWaterfallPlotData = createSelector(
  [ getFilteredViewData, getViewBy(datasetKey) ],
  (filteredData, viewBy) => {
    if (!filteredData) {
      return {};
    }

    // use different IDs and labels depending onthe view
    let idKey, labelKey;
    // by drug, use cell line ID/labels for measurements
    if (viewBy === 'drug') {
      idKey = 'id';
      labelKey  = 'label';

    // by cell line, use drug ID/labels for measurements
    } else {
      idKey = 'small_molecule_HMSLID';
      labelKey = 'small_molecule';
    }

    // create the data objects
    const waterfallData = {
      gr50: [],
      grMax: []
    };

    filteredData.map(d => {
      // shared attrs in both datasets
      const base = {
        id: d[idKey],
        label: d[labelKey],
        cell_line: d.cell_line
      };

      // value depends on the variable
      waterfallData.gr50.push(Object.assign({}, base, { value: d.GR50 }));
      waterfallData.grMax.push(Object.assign({}, base, { value: d.GRmax }));
    });

    return waterfallData;
  }
);

/**
 * A selector that creates the filter groups based on what values are in the
 * data. Note that this does not use the filtered data since we need all the
 * potential values.
 *
 * Input selectors:
 *   - getDataset
 *   - getViewBy
 *
 * @return {Array} The filter groups definition
 */
export const getFilterGroups = createSelector(
  [ getDataset(datasetId), getViewBy(datasetKey) ],
  (dataset, viewBy) => {
    const filterGroups = [];

    // VIEW BY: drug
    // ------------------------------------
    // get the list of drugs to choose from
    if (viewBy === 'drug') {
      let drugs = [];
      if (dataset) {
        drugs = _.chain(dataset)
          .keyBy('small_molecule_HMSLID')
          .values()
          .map(d => ({ label: d.small_molecule, value: d.small_molecule_HMSLID }))
          .sortBy('label')
          .value();
      }

      const drugConfiguration = [
        {
          id: 'drug',
          label: 'Drug',
          type: 'select',
          values: drugs,
          options: {
            props: { counts: null }
          }
        }
      ];

      filterGroups.push({
        id: 'drugConfig',
        label: 'Configure',
        clearable: false,
        filters: drugConfiguration
      });

      // add in cell line filters without the dataset option
      filterGroups.push({
        id: cellLinesFilterGroup.id,
        label: cellLinesFilterGroup.label,
        filters: cellLinesFilterGroup.filters.filter(filter => filter.id !== 'dataset')
      });


    // VIEW BY: cell line
    // ------------------------------------
    // configure cell lines config
    } else {
      let cellLines = [];
      if (dataset) {
        cellLines = _.chain(dataset)
          .keyBy('id')
          .values()
          .map(d => ({ label: d.label, value: d.id }))
          .sortBy('label')
          .value();
      }

      const cellLineConfiguration = [
        {
          id: 'cellLine',
          label: 'Cell Lines',
          type: 'select',
          values: cellLines,
          options: {
            props: { counts: null }
          }
        }
      ];

      filterGroups.push({
        id: 'cellLineConfig',
        label: 'Configure',
        clearable: false,
        filters: cellLineConfiguration
      });
    }


    return filterGroups;
  }
);
