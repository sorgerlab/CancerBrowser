import {
  DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_FILTERS,
  DATASET_RECEPTOR_PROFILE_CHANGE_VIEW_BY,
  DATASET_RECEPTOR_PROFILE_CHANGE_HIGHLIGHT,
  DATASET_RECEPTOR_PROFILE_CHANGE_TOGGLED,
  DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_COLOR_BY,
  DATASET_RECEPTOR_PROFILE_CHANGE_SIDE,
  DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_SORT_BY,
  DATASET_RECEPTOR_PROFILE_CHANGE_CELL_LINE_SORT_BY
} from '../actions/datasetReceptorProfile';

const INITIAL_STATE = {
  baseFilters: {
    cellLineFilters: [
      { id: 'dataset', values: ['receptor_profile'] }
    ]
  },

  activeFilters: {
  },

  viewBy: 'cellLine',
  highlight: undefined,
  toggled: undefined,
  receptorColorBy: 'cellLineReceptorStatus',
  receptorSortBy: 'magnitude',
  cellLineSortBy: 'magnitude',
  side: 'right'
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
    case DATASET_RECEPTOR_PROFILE_CHANGE_TOGGLED:
      return Object.assign({}, state, {
        toggled: action.toggledId
      });
    case DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_COLOR_BY:
      return Object.assign({}, state, {
        receptorColorBy: action.colorBy
      });
    case DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_SORT_BY:
      return Object.assign({}, state, {
        receptorSortBy: action.receptorSortBy
      });
    case DATASET_RECEPTOR_PROFILE_CHANGE_CELL_LINE_SORT_BY:
      return Object.assign({}, state, {
        cellLineSortBy: action.cellLineSortBy
      });
    case DATASET_RECEPTOR_PROFILE_CHANGE_SIDE:
      {
        let side = action.side;
        // if side not specified, set to right
        if(!side) {
          side = 'right';
        }

        return Object.assign({}, state, {
          side: side
        });
      }
    default:
      return state;
  }
}

export default datasetReceptorProfile;
