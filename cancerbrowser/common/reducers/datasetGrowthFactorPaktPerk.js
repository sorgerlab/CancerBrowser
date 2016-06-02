import {
  CHANGE_ACTIVE_FILTERS,
  CHANGE_VIEW_BY
} from '../actions/datasetGrowthFactorPaktPerk';

// Ensure the dataset filter is set to this dataset
const baseCellLineDatasetFilter = {
  id: 'dataset',
  values: ['growth_factor_pakt_perk']
};

const INITIAL_STATE = {
  activeFilters: { cellLineFilters: [baseCellLineDatasetFilter] },
  viewBy: 'growthFactor'
};

function datasetGrowthFactorPaktPerk(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_ACTIVE_FILTERS:
      return Object.assign({}, state, {
        activeFilters: action.activeFilters
      });
    case CHANGE_VIEW_BY:
      return Object.assign({}, state, {
        viewBy: action.viewBy
      });
    default:
      return state;
  }
}

export default datasetGrowthFactorPaktPerk;
