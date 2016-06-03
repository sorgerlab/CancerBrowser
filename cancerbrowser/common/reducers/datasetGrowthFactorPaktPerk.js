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
  activeFilters: {
    cellLineFilters: [baseCellLineDatasetFilter],
    growthFactorConfig: [
      { id: 'concentration', values: ['1'] },
      { id: 'parameter', values: ['paktFoldChange'] },
      { id: 'growthFactor', values: ['200852.0'] }
    ]
  },
  viewBy: 'growthFactor',
  highlight: undefined
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
    case DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_HIGHLIGHT:
      return Object.assign({}, state, {
        highlight: action.highlightId
      });
    default:
      return state;
  }
}

export default datasetGrowthFactorPaktPerk;
