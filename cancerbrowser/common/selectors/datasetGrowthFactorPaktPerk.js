import { createSelector } from 'reselect';
import _ from 'lodash';
import { getDataset, getViewBy } from './dataset';
import { cellLinesFilterGroup, getFilteredCellLines } from './cell_line';
import { getFilterValue } from '../utils/filter_utils';

const datasetId = 'growth_factor_pakt_perk';
const datasetKey = 'datasetGrowthFactorPaktPerk';


/////////////////////
// Input Selectors
/////////////////////


function getActiveGrowthFactor(state) {
  const activeFilters = state.datasets[datasetKey].activeFilters;
  return getFilterValue(activeFilters, 'growthFactorConfig', 'growthFactor') || '200852.0';
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
  [ getDataset(datasetId), getViewBy(datasetKey), getActiveGrowthFactor,
    getFilteredCellLines ],
  (dataset, viewBy, activeGrowthFactor, filteredCellLines) => {
    if (viewBy === 'growthFactor') {
      /*
        growthfactor
          metric(fold change, raw)
            parameter(perk, pakt)
              time(10min, 30min, 90min)
      */
      if (!dataset) {
        return dataset;
      }

      const filteredData = dataset.filter(d => d['Protein HMS LINCS ID'] === activeGrowthFactor);

      const reducedData = filteredData.reduce((reducedData, d) => {
        d.measurements.forEach(m => {
          const { time, type, metric } = m;
          if (!reducedData[metric]) {
            reducedData[metric] = {};
          }

          if (!reducedData[metric][type]) {
            reducedData[metric][type] = {};
          }

          if (!reducedData[metric][type][time]) {
            reducedData[metric][type][time] = [];
          }

          const preparedMeasurement = Object.assign({}, m, {
            id: d['Cell Line HMS LINCS ID'],
            label: d['Cell Line Name']
          });

          reducedData[metric][type][time].push(preparedMeasurement);
        });
        return reducedData;
      }, {});

      return reducedData;
    } else {
      return dataset;
    }
  }
);


/** Gets the filter group definition based on what is in the data */
export const getFilterGroups = createSelector(
  [ getDataset(datasetId), getViewBy(datasetKey) ],
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
          id: 'parameter',
          label: 'Parameter',
          type: 'select',
          values: [
            { label: 'pAKT Fold Change', value: 'paktFoldChange' },
            { label: 'pERK Fold Change', value: 'perkFoldChange' },
            { label: 'pAKT Raw Values', value: 'paktRawValues' },
            { label: 'pERK Raw Values', value: 'perkRawValues' }
          ],
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

    // remove the dataset from the cell lines group
    // filterGroups.push({
    //   id: cellLinesFilterGroup.id,
    //   label: cellLinesFilterGroup.label,
    //   filters: cellLinesFilterGroup.filters.filter(filter => filter.id !== 'dataset')
    // });

    return filterGroups;
  }
);
