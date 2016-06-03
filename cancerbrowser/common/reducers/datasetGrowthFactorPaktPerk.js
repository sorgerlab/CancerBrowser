import {
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_ACTIVE_FILTERS,
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_VIEW_BY,
  DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_HIGHLIGHT
} from '../actions/datasetGrowthFactorPaktPerk';

// Ensure the dataset filter is set to this dataset
const baseCellLineDatasetFilter = {
  id: 'dataset',
  values: ['growth_factor_pakt_perk']
};

const INITIAL_STATE = {
  activeFilters: { cellLineFilters: [baseCellLineDatasetFilter] },
  viewBy: 'growthFactor',
  highlight: undefined
};

function datasetGrowthFactorPaktPerk(state = INITIAL_STATE, action) {
  switch (action.type) {
    case DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_ACTIVE_FILTERS:
      return Object.assign({}, state, {
        activeFilters: action.activeFilters
      });
    case DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_VIEW_BY:
      return Object.assign({}, state, {
        viewBy: action.viewBy
      });
    case DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_HIGHLIGHT:
      return Object.assign({}, state, {
        highlight: action.highlightId
      });
    default:
      return state;
  }
}

export default datasetGrowthFactorPaktPerk;
