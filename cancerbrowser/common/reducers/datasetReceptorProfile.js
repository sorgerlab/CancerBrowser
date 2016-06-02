import {
  CHANGE_ACTIVE_FILTERS,
  CHANGE_VIEW_BY
} from '../actions/datasetReceptorProfile';

// Ensure the dataset filter is set to this dataset
const baseCellLineDatasetFilter = {
  id: 'dataset',
  values: ['receptor_profile']
};

const INITIAL_STATE = {
  activeFilters: { cellLineFilters: [baseCellLineDatasetFilter] },
  viewBy: 'receptor'
};

function datasetReceptorProfile(state = INITIAL_STATE, action) {
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

export default datasetReceptorProfile;
