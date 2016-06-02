import {
  CHANGE_ACTIVE_FILTERS,
  CHANGE_VIEW_BY,
  CHANGE_HIGHLIGHT,
  CHANGE_ACTIVE_LEFT,
  CHANGE_ACTIVE_RIGHT
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
  activeRight: undefined
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
    case CHANGE_HIGHLIGHT:
      return Object.assign({}, state, {
        highlight: action.highlightId
      });
    case CHANGE_ACTIVE_LEFT:
      return Object.assign({}, state, {
        activeLeft: action.activeId
      });
    case CHANGE_ACTIVE_RIGHT:
      return Object.assign({}, state, {
        activeRight: action.activeId
      });
    default:
      return state;
  }
}

export default datasetReceptorProfile;
