import {
  DATASET_BASAL_PHOSPHO_CHANGE_ACTIVE_FILTERS,
  RECEIVE_DATASET_BASAL_PHOSPHO
} from '../actions/datasetBasalPhospho';


const INITIAL_STATE = {
  activeFilters: {}

};

function datasetBasalPhospho(state = INITIAL_STATE, action) {
  switch (action.type) {
    case DATASET_BASAL_PHOSPHO_CHANGE_ACTIVE_FILTERS:
      // reset to the initial state of set to null or undefined
      return Object.assign({}, state, {
        activeFilters: action.activeFilters == null ? INITIAL_STATE.activeFilters : action.activeFilters
      });

    case RECEIVE_DATASET_BASAL_PHOSPHO:
      return Object.assign({}, state, {
        data: action.data
      });

    default:
      return state;
  }
}

export default datasetBasalPhospho;
