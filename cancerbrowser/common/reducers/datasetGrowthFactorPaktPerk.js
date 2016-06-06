import {
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_ACTIVE_FILTERS,
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_VIEW_BY,
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_HIGHLIGHTED_CELL_LINE,
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_GROWTH_FACTOR_COLOR_BY,
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_GROWTH_FACTOR_SORT_BY,
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_HIGHLIGHTED_GROWTH_FACTOR,
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_CELL_LINE_COLOR_BY,
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_CELL_LINE_SORT_BY

} from '../actions/datasetGrowthFactorPaktPerk';

// Ensure the dataset filter is set to this dataset
const baseCellLineDatasetFilter = {
  id: 'dataset',
  values: ['growth_factor_pakt_perk']
};

const INITIAL_STATE = {
  activeFilters: {
    cellLineFilters: [baseCellLineDatasetFilter],

    growthFactorConfig: [
      { id: 'concentration', values: ['1'] },
      { id: 'parameter', values: ['paktFoldChange'] },
      { id: 'growthFactor', values: ['200852.0'] }
    ],
    cellLineConfig: [
      { id: 'concentration', values: ['1'] },
      { id: 'parameter', values: ['paktFoldChange'] },
      { id: 'cellLine', values: ['mcf7'] }
    ]
  },
  viewBy: 'cellLine',

  growthFactorColorBy: 'cellLineReceptorStatus',
  growthFactorSortBy: 'magnitude',
  highlightedCellLine: undefined,

  cellLineSortBy: 'magnitude',
  highlightedGrowthFactor: undefined
};

function datasetGrowthFactorPaktPerk(state = INITIAL_STATE, action) {
  switch (action.type) {
    case DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_ACTIVE_FILTERS:
      // reset to the initial state of set to null or undefined
      return Object.assign({}, state, {
        activeFilters: action.activeFilters == null ? INITIAL_STATE.activeFilters : action.activeFilters
      });
    case DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_VIEW_BY:
      return Object.assign({}, state, {
        viewBy: action.viewBy
      });
    case DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_GROWTH_FACTOR_COLOR_BY:
      return Object.assign({}, state, {
        growthFactorColorBy: action.growthFactorColorBy
      });
    case DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_GROWTH_FACTOR_SORT_BY:
      return Object.assign({}, state, {
        growthFactorSortBy: action.growthFactorSortBy
      });
    case DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_HIGHLIGHTED_CELL_LINE:
      return Object.assign({}, state, {
        highlightedCellLine: action.highlightId
      });
    case DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_CELL_LINE_COLOR_BY:
      return Object.assign({}, state, {
        cellLineColorBy: action.cellLineColorBy
      });
    case DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_CELL_LINE_SORT_BY:
      return Object.assign({}, state, {
        cellLineSortBy: action.cellLineSortBy
      });
    case DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_HIGHLIGHTED_GROWTH_FACTOR:
      return Object.assign({}, state, {
        highlightedGrowthFactor: action.highlightId
      });
    default:
      return state;
  }
}

export default datasetGrowthFactorPaktPerk;
