import { createSelector } from 'reselect';
import _ from 'lodash';
import { getDataset, getViewBy, getFilteredCellLines } from './dataset';
import { cellLineFilters } from '../containers/CellLineBrowserPage';

const datasetId = 'growth_factor_pakt_perk';
const datasetKey = 'datasetGrowthFactorPaktPerk';

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

/** Converts the dataset to be by cell line or by receptor */
export const getViewData = createSelector(
  [ getDataset(datasetId), getViewBy(datasetKey) ],
  (dataset, viewBy) => {
    if (viewBy === 'growthFactor') {
      return dataset; // TODO
    } else {
      return dataset;
    }
  }
);


/** Filters the dataset */
export const getFilteredViewData = createSelector(
  [ getViewData, getViewBy(datasetKey), getFilteredCellLines ],
  (viewData, viewBy, filteredCellLines) => {
    if (viewBy === 'growthFactor') {
      return viewData; // TODO
    } else {
      return filterDataByCellLines(viewData, filteredCellLines);
    }
  }
);


/** Gets the filter group definition based on what is in the data */
export const getFilterGroups = createSelector(
  [ getViewData, getViewBy(datasetKey) ],
  (viewData, viewBy) => {
    const filterGroups = [];

    // get the list of growth factors to choose from
    if (viewBy === 'growthFactor') {
      let growthFactors = [];
      if (viewData) {
        growthFactors = _.chain(viewData)
          .keyBy('Protein Name')
          .values()
          .map(d => ({ label: d['Protein Name'], value: d['Protein HMS LINCS ID'] }))
          .value();
      }

      const growthFactorConfiguration = [
        {
          id: 'growthFactor',
          label: 'Growth Factor',
          type: 'select',
          values: growthFactors,
          options: {
            props: { counts: null }
          }
        },
        {
          id: 'compareTo',
          label: 'Compare to',
          type: 'select',
          values: growthFactors,
          options: {
            props: { counts: null }
          }
        }
      ];
      filterGroups.push({
        id: 'growthFactorConfig',
        label: 'Configure',
        filters: growthFactorConfiguration
      });
    }

    filterGroups.push({
      id: 'cellLineFilters',
      label: 'Cell Line Filters',
      filters: cellLineFilters.filter(filter => filter.id !== 'dataset')
    });

    return filterGroups;
  }
);
