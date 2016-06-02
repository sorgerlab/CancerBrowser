import { CHANGE_ACTIVE_FILTERS } from '../actions/datasetReceptorProfile';

const baseCellLineDatasetFilter = {
  id: 'dataset',
  values: ['receptor_profile']
};

const INITIAL_STATE = {
  activeFilters: { cellLineFilters: [baseCellLineDatasetFilter] }
};

function datasetReceptorProfile(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_ACTIVE_FILTERS:
      return Object.assign({}, state, {
        activeFilters: action.activeFilters
      });
    default:
      return state;
  }
}

export default datasetReceptorProfile;
