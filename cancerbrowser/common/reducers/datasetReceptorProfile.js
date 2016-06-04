import {
  DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_FILTERS,
  DATASET_RECEPTOR_PROFILE_CHANGE_VIEW_BY,
  DATASET_RECEPTOR_PROFILE_CHANGE_HIGHLIGHT,
  DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_COLOR_BY,
  DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_LEFT,
  DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_RIGHT
} from '../actions/datasetReceptorProfile';

// Ensure the dataset filter is set to this dataset
const baseCellLineDatasetFilter = {
  id: 'dataset',
  values: ['receptor_profile']
};

const INITIAL_STATE = {
  activeFilters: { cellLineFilters: [baseCellLineDatasetFilter] },
  viewBy: 'cellLine',
  highlight: undefined,
  activeLeft: undefined,
  activeRight: undefined,
  receptorColorBy: 'cellLineReceptorStatus'
};

function datasetReceptorProfile(state = INITIAL_STATE, action) {
  switch (action.type) {
    case DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_FILTERS:
      // reset to the initial state of set to null or undefined
      return Object.assign({}, state, {
        activeFilters: action.activeFilters == null ? INITIAL_STATE.activeFilters : action.activeFilters
      });
    case DATASET_RECEPTOR_PROFILE_CHANGE_VIEW_BY:
      return Object.assign({}, state, {
        viewBy: action.viewBy
      });
    case DATASET_RECEPTOR_PROFILE_CHANGE_HIGHLIGHT:
      return Object.assign({}, state, {
        highlight: action.highlightId
      });
    case DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_COLOR_BY:
      return Object.assign({}, state, {
        receptorColorBy: action.colorBy
      });
    case DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_LEFT:
      return Object.assign({}, state, {
        activeLeft: action.activeId
      });
    case DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_RIGHT:
      return Object.assign({}, state, {
        activeRight: action.activeId
      });
    default:
      return state;
  }
}

export default datasetReceptorProfile;
