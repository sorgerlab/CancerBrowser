import { createSelector } from 'reselect';
import _ from 'lodash';
import { getDataset } from './dataset';
import { getFilterValues } from '../utils/filter_utils';

const datasetId = 'basal_total';
const datasetKey = 'datasetBasalTotal';


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

function getActiveCellLines(state) {
  const activeFilters = state.datasets[datasetKey].activeFilters;
  // console.log(getFilterValueItem(activeFilters, 'basalPhospho',  ))
  return getFilterValues(activeFilters, 'basalTotal', 'cellLine');
}



/////////////////////
// Selectors
/////////////////////

/** Converts the dataset to be by cell line or by receptor */
export const getViewData = createSelector(
  [ getDataset(datasetId) ],
  (dataset) => {
    return dataset;
  }
);

/** Filters the dataset */
export const getFilteredViewData = createSelector(
  [ getViewData, getActiveCellLines ],
  (viewData, activeCellLines) => {
    return filterDataByCellLines(viewData, activeCellLines);
  }
);


/** Gets the filter group definition based on what is in the data */
export const getFilterGroups = createSelector(
  [ getViewData ],
  (viewData) => {
    const filterGroups = [];

    let cellLines = [];

    if(viewData) {
      cellLines = _.map(viewData[0].measurements, (d) => { return {value:d.id, label:d.label}; });
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
