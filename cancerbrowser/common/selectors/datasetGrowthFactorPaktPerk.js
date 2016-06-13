import { createSelector } from 'reselect';
import _ from 'lodash';
import { getDataset, getViewBy } from './dataset';
import { cellLinesFilterGroup, getFilteredCellLines } from './cell_line';
import { getFilterValue } from '../utils/filter_utils';
import { sortByKey } from '../utils/sort';

const datasetId = 'growth_factor_pakt_perk';
const datasetRawId = 'growth_factor_pakt_perk_raw';
const datasetKey = 'datasetGrowthFactorPaktPerk';


/////////////////////
// Input Selectors
/////////////////////

/**
 * An input selector for getting the active growth factor
 *
 * @param {Object} The redux state
 * @return {String} The ID of the active growth factor
 */
function getActiveGrowthFactor(state) {
  const activeFilters = state.datasets[datasetKey].activeFilters;
  return getFilterValue(activeFilters, 'datasetConfig', 'growthFactor');
}

/**
 * An input selector for getting the active cell line
 *
 * @param {Object} The redux state
 * @return {String} The ID of the active cell line
 */
function getActiveCellLine(state) {
  const activeFilters = state.datasets[datasetKey].activeFilters;
  return getFilterValue(activeFilters, 'datasetConfig', 'cellLine');
}

/**
 * An input selector for getting the active parameter ('pAKT fold change', etc.)
 * Often easier to use the parsed getActiveMetricAndType below
 *
 * @param {Object} The redux state
 * @return {String} The ID of the active parameter
 */
function getActiveParameter(state) {
  const activeFilters = state.datasets[datasetKey].activeFilters;
  return getFilterValue(activeFilters, 'datasetConfig', 'parameter');
}

/**
 * An input selector for getting the active concentration (1ng/mL, 100ng/mL)
 *
 * @param {Object} The redux state
 * @return {String} The ID of the active concentration
 */
function getActiveConcentration(state) {
  const activeFilters = state.datasets[datasetKey].activeFilters;
  return getFilterValue(activeFilters, 'datasetConfig', 'concentration');
}

/**
 * An input selector for getting the active metric (raw, fold change)
 * and type (pERK, pAKT)
 *
 * @param {Object} The redux state
 * @return {String} The ID of the active metric and type
 */
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

/**
 * An input selector for getting the active dataset file
 * This is necessary since there are two dataset files associated
 * with this data page -- one for fold change, and one for raw values.
 *
 * @param {Object} The redux state
 * @return {String} The ID of the active drug
 */
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
 * A selector that filters the dataset to match the configuration
 * of the page (cell lines, parameter, concentration, etc.)
 *
 * Input selectors:
 *   - getActiveDataset
 *   - getViewBy
 *   - getActiveGrowthFactor
 *   - getActiveCellLine
 *   - getActiveMetricAndType
 *   - getActiveConcentration
 *   - getFilteredCellLines
 *
 * @return {Array} The filtered dataset
 */
export const getFilteredViewData = createSelector(
  [ getActiveDataset, getViewBy(datasetKey),
    getActiveGrowthFactor, getActiveCellLine,
    getActiveMetricAndType, getActiveConcentration,
    getFilteredCellLines ],
  (dataset, viewBy, activeGrowthFactor, activeCellLine, { metric: activeMetric, type: activeType },
    activeConcentration, filteredCellLines) => {

    // filter by cell line first if we are viewing by growth factor
    let filteredData = dataset;
    if(viewBy === 'growthFactor') {
      filteredData = filterDataByCellLines(dataset, filteredCellLines);
    }

    // use different IDs and labels for different view bys
    let idFilterKey, idFilterValue, idKey, labelKey;

    // by growth factor, filter using growth factor ID then use cell line ID for the data points
    if (viewBy === 'growthFactor') {
      // for reducing the data set
      idFilterKey = 'Protein HMS LINCS ID';
      idFilterValue = activeGrowthFactor;

      // on the derived data points
      labelKey = 'Cell Line Name';
      idKey = 'id';

    // by cell line, filter using cell line ID then use growth factor ID for the data points
    } else {
      idFilterKey = 'id';
      idFilterValue = activeCellLine;

      // on the derived data points
      labelKey = 'Protein Name';
      idKey = 'Protein HMS LINCS ID';
    }

    if (!dataset) {
      return dataset;
    }

    // filter to just the selected concentration
    filteredData = filteredData.filter(d =>
      d[idFilterKey] === idFilterValue &&
      String(d['Ligand Concentration']) === String(activeConcentration));

    /* group by time if it matches the metric and type
     * ends up with form:
     * { 0min: [{id, label, value, d}, ...], 10min: ... }
     */
    const byTime = filteredData.reduce((byTime, d) => {

      // add in control values first as 0min
      if (activeMetric === 'raw values') {
        if (!byTime['0min']) {
          byTime['0min'] = [];
        }

        const preparedMeasurement = Object.assign({}, {
          id: d[idKey],
          label: d[labelKey],
          cell_line: d.cell_line,
          value: d[`Control ${activeType} (a.u.)`]
        });
        byTime['0min'].push(preparedMeasurement);
      }

      // add in values for the other time points
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
          id: d[idKey],
          label: d[labelKey],
          cell_line: d.cell_line
        });

        byTime[time].push(preparedMeasurement);
      });

      return byTime;
    }, {});
    return byTime;
  }
);

/**
 * A selector that derives the parallel coordinates plot data. Each
 * x point gets its own item in the array.
 *
 * Input selectors:
 *   - getFilteredViewData (a selector)
 *
 * @return {Array} The plot data `[{ label, id, cell_line, values }, ...]`
 */
export const getParallelCoordinatesPlotData = createSelector(
  [ getFilteredViewData ],
  (viewData) => {
    // get the object values
    const valuesArray = _.values(viewData);

    // zip them to arrays by item (assumes each item is in the
    // same index in viewData in each keyed obj
    // (e.g. viewData.10min[1].id === viewData.30min[1].id === viewData.90min[1].id))
    const perItem = _.zip.apply(this, valuesArray);

    const formatted = perItem.map(data => ({
      label: data[0].label,
      id: data[0].id,
      cell_line: data[0].cell_line,
      values: data.map(d => d.value)
    }));

    return formatted;
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
  (viewData, viewBy) => {
    const filterGroups = [];

    // define shared filters (parameter, concentration)
    const parameter = {
      id: 'parameter',
      label: 'Assay Parameter',
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
    };

    const concentration = {
      id: 'concentration',
      label: ' Growth Factor Concentration',
      type: 'select',
      values: [
        { label: '1ng/mL', value: '1' },
        { label: '100ng/mL', value: '100' }
      ],
      options: {
        props: { counts: null }
      }
    };

    // VIEW BY: growth factor
    // ------------------------------------
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
        parameter,
        concentration
      ];


      // important that in this view and in cell line view they use the same ID to share state
      // (i.e., the selected parameter and concentration)
      filterGroups.push({
        id: 'datasetConfig',
        label: 'Configure',
        clearable: false,
        filters: growthFactorConfiguration
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
      if (viewData) {
        cellLines = _.chain(viewData)
          .keyBy('id')
          .values()
          .map(d => ({ label: d['Cell Line Name'], value: d['id'] }))
          .value();

        cellLines.sort(sortByKey('value'));
      }

      const cellLineConfiguration = [
        {
          id: 'cellLine',
          label: 'Cell Line',
          type: 'select',
          values: cellLines,
          options: {
            props: { counts: null }
          }
        },
        parameter,
        concentration
      ];

      filterGroups.push({
        id: 'datasetConfig',
        label: 'Configure',
        clearable: false,
        filters: cellLineConfiguration
      });
    }


    return filterGroups;
  }
);
