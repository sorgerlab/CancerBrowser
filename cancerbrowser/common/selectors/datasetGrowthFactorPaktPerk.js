import { createSelector } from 'reselect';
import _ from 'lodash';
import { getDataset, getViewBy } from './dataset';
import { cellLinesFilterGroup, getFilteredCellLines } from './cell_line';
import { getFilterValue } from '../utils/filter_utils';

const datasetId = 'growth_factor_pakt_perk';
const datasetRawId = 'growth_factor_pakt_perk_raw';
const datasetKey = 'datasetGrowthFactorPaktPerk';


/////////////////////
// Input Selectors
/////////////////////


function getActiveGrowthFactor(state) {
  const activeFilters = state.datasets[datasetKey].activeFilters;
  return getFilterValue(activeFilters, 'growthFactorConfig', 'growthFactor');
}

function getActiveParameter(state) {
  const activeFilters = state.datasets[datasetKey].activeFilters;
  return getFilterValue(activeFilters, 'growthFactorConfig', 'parameter');
}

function getActiveConcentration(state) {
  const activeFilters = state.datasets[datasetKey].activeFilters;
  return getFilterValue(activeFilters, 'growthFactorConfig', 'concentration');
}

function getActiveMetricAndType(state) {
  const parameter = getActiveParameter(state);

  if (!parameter) {
    return {};
  }

  let result = {};

  switch(parameter) {
    case 'paktFoldChange':
      result.metric = 'fold change';
      result.type = 'pAkt';
      break;
    case 'paktRawValues':
      result.metric = 'raw values';
      result.type = 'pAkt';
      break;
    case 'perkFoldChange':
      result.metric = 'fold change';
      result.type = 'pErk';
      break;
    case 'perkRawValues':
      result.metric = 'raw values';
      result.type = 'pErk';
      break;
  }

  return result;
}


function getActiveDataset(state) {
  const activeParameter = getActiveParameter(state);
  if (activeParameter === 'perkFoldChange' || activeParameter === 'paktFoldChange') {
    return getDataset(datasetId, state);
  } else {
    return getDataset(datasetRawId, state);
  }
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
  [ getActiveDataset, getViewBy(datasetKey),
    getActiveGrowthFactor, getActiveMetricAndType, getActiveConcentration,
    getFilteredCellLines ],
  (dataset, viewBy, activeGrowthFactor, { type: activeType },
    activeConcentration, filteredCellLines) => {

    const datasetFilteredByCellLines = filterDataByCellLines(dataset, filteredCellLines);

    if (viewBy === 'growthFactor') {
      if (!dataset) {
        return dataset;
      }

      // filter to just the selected growth factor and concentration first
      const filteredData = datasetFilteredByCellLines.filter(d =>
        d['Protein HMS LINCS ID'] === activeGrowthFactor &&
        String(d['Ligand Concentration']) === String(activeConcentration));

      /* group by time if it matches the metric and type
       * ends up with form:
       * { 10m: [{id, label, value, d}, ...], 30m: ... }
       */
      const byTime = filteredData.reduce((byTime, d) => {
        d.measurements.forEach(m => {
          const { time } = m;

          // filter out wrong type (pakt, perk) (note that metric filtered by active dataset already)
          if (m.type !== activeType) {
            return;
          }

          if (!byTime[time]) {
            byTime[time] = [];
          }

          const preparedMeasurement = Object.assign({}, m, {
            id: d['Cell Line HMS LINCS ID'],
            label: d['Cell Line Name'],
            d
          });

          byTime[time].push(preparedMeasurement);
        });
        return byTime;
      }, {});
      return byTime;
    } else {
      return datasetFilteredByCellLines;
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
        },
        {
          id: 'concentration',
          label: 'Ligand Concentration',
          type: 'select',
          values: [
            { label: '1ng/mL', value: '1' },
            { label: '100ng/mL', value: '100' }
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

    // add in cell line filters without the dataset option
    filterGroups.push({
      id: cellLinesFilterGroup.id,
      label: cellLinesFilterGroup.label,
      filters: cellLinesFilterGroup.filters.filter(filter => filter.id !== 'dataset')
    });

    return filterGroups;
  }
);
