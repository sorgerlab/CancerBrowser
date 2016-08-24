import {
  getBasalPhosphoDataset
} from '../api/dataset';

export const DATASET_BASAL_PHOSPHO_CHANGE_ACTIVE_FILTERS = 'DATASET_BASAL_PHOSPHO_CHANGE_ACTIVE_FILTERS';
export const RECEIVE_DATASET_BASAL_PHOSPHO = 'RECEIVE_DATASET_BASAL_PHOSPHO';

/**
 * Action creator to modify the active filters for
 * dataset basal phosopo page
 * @param {Object} activeFilters new filters of page
 */
export function changeActiveFilters(activeFilters) {
  return {
    type: DATASET_BASAL_PHOSPHO_CHANGE_ACTIVE_FILTERS,
    activeFilters
  };
}

/**
 * Action creator for setting basal phospho data
 * @param {Object} basal phospho data
 */
function receiveBasalPhosphoDataset(data) {
  return {
    type: RECEIVE_DATASET_BASAL_PHOSPHO,
    data: data
  };
}

export function fetchBasalPhosphoDataset() {
  return dispatch => {
    dispatch(getBasalPhosphoDataset());
    api.getDatasets().then(
      data => dispatch(receiveDatasets(data))
    );
  };
}
