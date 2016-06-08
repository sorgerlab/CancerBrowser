import { combineReducers } from 'redux';
import {
  REQUEST_DATASETS_INFO,
  RECEIVE_DATASETS_INFO,
  REQUEST_DATASET,
  RECEIVE_DATASET
} from '../actions/dataset';

import datasetReceptorProfile from './datasetReceptorProfile';
import datasetGrowthFactorPaktPerk from './datasetGrowthFactorPaktPerk';
import datasetBasalPhospho from './datasetBasalPhospho';
import datasetBasalTotal from './datasetBasalTotal';
import datasetDrugDoseResponse from './datasetDrugDoseResponse';

const INITIAL_STATE = {
  info: {
    isFetching: false,
    items: {},
    primaryDatasets: {}
  },

  datasetsById: {}
};


function info(state = INITIAL_STATE.info, action) {
  switch (action.type) {
    case REQUEST_DATASETS_INFO:
      return Object.assign({}, state, {
        isFetching: true
      });

    case RECEIVE_DATASETS_INFO: {
      // store a filtered map that only includes the primary datasets too
      const primaryDatasets = Object.keys(action.datasets).reduce((primaryDatasets, key) => {
        if (!action.datasets[key].exclude_from_datasets) {
          primaryDatasets[key] = action.datasets[key];
        }

        return primaryDatasets;
      }, {});

      return Object.assign({}, state, {
        isFetching: false,
        items: action.datasets,
        primaryDatasets
      });
    }

    default:
      return state;
  }
}

function datasetsById(state = INITIAL_STATE.datasetsById, action) {
  switch (action.type) {
    case REQUEST_DATASET:
      return Object.assign({}, state, {
        [action.datasetId]: {
          isFetching: true
        }
      });
    case RECEIVE_DATASET:
      return Object.assign({}, state, {
        [action.datasetId]: {
          isFetching: false,
          items: action.dataset
        }
      });
    default:
      return state;
  }
}

export default combineReducers({
  info,
  datasetsById,
  datasetReceptorProfile,
  datasetGrowthFactorPaktPerk,
  datasetBasalTotal,
  datasetBasalPhospho,
  datasetDrugDoseResponse
});
