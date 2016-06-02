import { combineReducers } from 'redux';
import {
  REQUEST_DATASETS_INFO,
  RECEIVE_DATASETS_INFO,
  REQUEST_DATASET,
  RECEIVE_DATASET
} from '../actions/dataset';

import datasetReceptorProfile from './datasetReceptorProfile';

const INITIAL_STATE = {
  info: {
    isFetching: false,
    items: {}
  },

  datasetsById: {}
};


function info(state = INITIAL_STATE.info, action) {
  switch (action.type) {
    case REQUEST_DATASETS_INFO:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_DATASETS_INFO:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.datasets
      });
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

export default combineReducers({ info, datasetsById, datasetReceptorProfile });
