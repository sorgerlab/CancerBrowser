import {
  DATASET_BASAL_TOTAL_CHANGE_ACTIVE_FILTERS
} from '../actions/datasetBasalTotal';


const INITIAL_STATE = {
  activeFilters: {}

};

function datasetBasalTotal(state = INITIAL_STATE, action) {
  switch (action.type) {
    case DATASET_BASAL_TOTAL_CHANGE_ACTIVE_FILTERS:
      // reset to the initial state of set to null or undefined
      return Object.assign({}, state, {
        activeFilters: action.activeFilters == null ? INITIAL_STATE.activeFilters : action.activeFilters
      });
    default:
      return state;
  }
}

export default datasetBasalTotal;
