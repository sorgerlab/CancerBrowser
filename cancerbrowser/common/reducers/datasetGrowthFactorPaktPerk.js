import {
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_ACTIVE_FILTERS,
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_VIEW_BY,
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_HIGHLIGHTED_CELL_LINE,
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_TOGGLED_CELL_LINE,
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_GROWTH_FACTOR_COLOR_BY,
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_GROWTH_FACTOR_SORT_BY,
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_HIGHLIGHTED_GROWTH_FACTOR,
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_TOGGLED_GROWTH_FACTOR,
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_CELL_LINE_COLOR_BY,
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_CELL_LINE_SORT_BY

} from '../actions/datasetGrowthFactorPaktPerk';

const INITIAL_STATE = {
  baseFilters: {
    cellLineFilters: [
      { id: 'dataset', values: ['growth_factor_pakt_perk'] }
    ]
  },

  activeFilters: {
    datasetConfig: [
      { id: 'concentration', values: ['1'] },
      { id: 'parameter', values: ['paktFoldChange'] }
    ]
  },
  viewBy: 'growthFactor',

  growthFactorColorBy: 'cellLineReceptorStatus',
  growthFactorSortBy: 'magnitude',
  highlightedCellLine: undefined,
  toggledCellLine: undefined,

  cellLineSortBy: 'magnitude',
  highlightedGrowthFactor: undefined,
  toggledGrowthFactor: undefined
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
    case DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_TOGGLED_CELL_LINE:
      return Object.assign({}, state, {
        toggledCellLine: action.toggledId
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
    case DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_TOGGLED_GROWTH_FACTOR:
      return Object.assign({}, state, {
        toggledGrowthFactor: action.toggledId
      });
    default:
      return state;
  }
}

export default datasetGrowthFactorPaktPerk;
