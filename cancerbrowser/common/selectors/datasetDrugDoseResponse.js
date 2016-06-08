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


function getActiveDrug(state) {
  const activeFilters = state.datasets[datasetKey].activeFilters;
  return getFilterValue(activeFilters, 'drugConfig', 'drug');
}

function getActiveCellLine(state) {
  const activeFilters = state.datasets[datasetKey].activeFilters;
  return getFilterValue(activeFilters, 'cellLineConfig', 'cellLine');
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

/////////////////////
// Selectors
/////////////////////

/** Filters the dataset */
export const getFilteredViewData = createSelector(
  [ getDataset(datasetId), getViewBy(datasetKey),
    getActiveDrug, getActiveCellLine,
    getFilteredCellLines ],
  (dataset, viewBy, activeDrug, activeCellLine, filteredCellLines) => {
    if (!dataset) {
      return dataset;
    }

    const datasetFilteredByCellLines = filterDataByCellLines(dataset, filteredCellLines);
    let idFilterKey, idFilterValue;
    if (viewBy === 'drug') {
      idFilterKey = 'small_molecule_HMSLID';
      idFilterValue = activeDrug;
    } else {
      idFilterKey = 'id';
      idFilterValue = activeCellLine;
    }

    // NOTE sometimes GR50 can be -Inf or Inf
    const filteredData = datasetFilteredByCellLines.filter(d => d[idFilterKey] === idFilterValue);

    console.log('dataset', dataset);
    console.log('datasetFilteredByCellLines', datasetFilteredByCellLines);
    console.log('filtered data', idFilterKey, idFilterValue, filteredData);
    return filteredData;
  }
);

/** Gets the waterfall plot data, grouped by gr50 and grMax */
export const getWaterfallPlotData = createSelector(
  [ getFilteredViewData, getViewBy(datasetKey) ],
  (filteredData, viewBy) => {
    if (!filteredData) {
      return {};
    }

    let idKey, labelKey;
    if (viewBy === 'drug') {
      idKey = 'id';
      labelKey  = 'label';
    } else {
      idKey = 'small_molecule_HMSLID';
      labelKey = 'small_molecule';
    }

    const waterfallData = {
      gr50: [],
      grMax: []
    };

    filteredData.map(d => {
      const base = {
        id: d[idKey],
        label: d[labelKey],
        cell_line: d.cell_line
      };

      waterfallData.gr50.push(Object.assign({}, base, { value: d.GR50 }));
      waterfallData.grMax.push(Object.assign({}, base, { value: d.GRmax }));
    });

    return waterfallData;
  }
);

/** Gets the filter group definition based on what is in the data */
export const getFilterGroups = createSelector(
  [ getDataset(datasetId), getViewBy(datasetKey) ],
  (dataset, viewBy) => {
    const filterGroups = [];

    // get the list of drugs to choose from
    if (viewBy === 'drug') {
      let drugs = [];
      if (dataset) {
        drugs = _.chain(dataset)
          .keyBy('small_molecule_HMSLID')
          .values()
          .map(d => ({ label: d.small_molecule, value: d.small_molecule_HMSLID }))
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

    // configure cell lines config
    } else {
      let cellLines = [];
      if (dataset) {
        cellLines = _.chain(dataset)
          .keyBy('id')
          .values()
          .map(d => ({ label: d.label, value: d.id }))
          .value();
      }
      console.log('dataset=', dataset);

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
