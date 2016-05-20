// import fetch from 'isomorphic-fetch';

import api from '../api';

// Actions
export const REQUEST_DATASETS = 'REQUEST_DATASETS';
export const RECEIVE_DATASETS = 'RECEIVE_DATASETS';
export const REQUEST_DATASET_DETAIL = 'REQUEST_DATASET_DETAIL';
export const RECEIVE_DATASET_DETAIL = 'RECEIVE_DATASET_DETAIL';
export const REQUEST_CELLS = 'REQUEST_CELLS';
export const RECEIVE_CELLS = 'RECEIVE_CELLS';
export const REQUEST_CELLS_IN_DATASETS = 'REQUEST_CELLS_IN_DATASETS';
export const RECEIVE_CELLS_IN_DATASETS = 'RECEIVE_CELLS_IN_DATASETS';
export const CHANGE_CELL_FILTER = 'CHANGE_CELL_FILTER';
export const CHANGE_CELL_SUBTYPE_FILTER = 'CHANGE_CELL_SUBTYPE_FILTER';

// Action Creators
function requestDatasets() {
  return {
    type: REQUEST_DATASETS
  };
}

function receiveDatasets(json) {
  return {
    type: RECEIVE_DATASETS,
    datasets: json.datasets
  };
}

function requestDatasetDetail(datasetId) {
  return {
    type: REQUEST_DATASET_DETAIL,
    datasetId
  };
}

function receiveDatasetDetail(datasetId, json) {
  return {
    type: RECEIVE_DATASET_DETAIL,
    datasetId,
    datasetDetail: json.dataset
  };
}

function requestCells() {
  return {
    type: REQUEST_CELLS
  };
}

function receiveCells(cells, subtypes) {
  return {
    type: RECEIVE_CELLS,
    cells: cells,
    subtypes: subtypes
  };
}

function requestCellsInDatasets() {
  return {
    type: REQUEST_CELLS_IN_DATASETS
  };
}

function receiveCellsInDatasets(json) {
  return {
    type: RECEIVE_CELLS_IN_DATASETS,
    cellsInDatasets: json.cellsInDatasets
  };
}

// Helpers
export function fetchDatasets() {
  return dispatch => {
    dispatch(requestDatasets());
    api.getDatasets().then(
      json => dispatch(receiveDatasets(json))
    );
  };
}

function shouldFetchDatasets(state) {
  const { datasets } = state;

  if (!datasets.items) {
    return true;
  } else if (datasets.isFetching) {
    return false;
  }
  return false;
}

function fetchDatasetDetail(datasetId) {
  return dispatch => {
    dispatch(requestDatasetDetail(datasetId));
    api.getDataset(datasetId).then(
      json => dispatch(receiveDatasetDetail(datasetId, json))
    );
  };
}

function shouldFetchDatasetDetail(state, datasetId) {

  const { datasetDetails } = state;

  // If there are no datasetDetails at all
  if (!datasetDetails) {
    return true;
  }

  // If this particular datasetDetail does not exist
  if (!datasetDetails.hasOwnProperty(datasetId)) {
    return true;
  }

  const datasetDetail = state.datasetDetails[datasetId];

  // If this datasetDetail is already fetching
  if (datasetDetail.isFetching) {
    return false;
  }

  // If the datasetDetail exists, but is not populated
  if (!datasetDetail.item) {
    return true;
  }

  return false;
}

function fetchCells() {
  return dispatch => {
    dispatch(requestCells());
    api.getCells().then(
      json => dispatch(receiveCells(json.cells, json.subtypes))
    );
  };
}

function shouldFetchCells(state) {
  const cells = state.cells;

  if (!cells.items) {
    return true;
  } else if (cells.isFetching) {
    return false;
  }
  return false;
}

function fetchCellsInDatasets() {
  return dispatch => {
    dispatch(requestCellsInDatasets());
    api.getCellsInDatasets().then(
      json => dispatch(receiveCellsInDatasets(json))
    );
  };
}

function shouldFetchCellsInDatasets(state) {
  const cellsInDatasets = state.cellsInDatasets;

  if (!cellsInDatasets.items) {
    return true;
  } else if (cellsInDatasets.isFetching) {
    return false;
  }
  return false;
}


// Action Creators (Functions when using thunk)
export function fetchDatasetsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchDatasets(getState())) {
      return dispatch(fetchDatasets());
    } else {
      return Promise.resolve();
    }
  };
}

export function fetchDatasetDetailIfNeeded({ datasetId }) {
  return (dispatch, getState) => {
    if (shouldFetchDatasetDetail(getState(), datasetId)) {
      return dispatch(fetchDatasetDetail(datasetId));
    }
  };
}

export function fetchCellsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchCells(getState())) {
      return dispatch(fetchCells());
    }
  };
}

export function fetchCellsInDatasetsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchCellsInDatasets(getState())) {
      return dispatch(fetchCellsInDatasets());
    }
  };
}

export function changeCellSubtypeFilter(subtype) {
  return {
    type: CHANGE_CELL_SUBTYPE_FILTER,
    subtype: subtype
  };
}

export function changeCellFilter(cell) {
  return {
    type: CHANGE_CELL_FILTER,
    cell: cell
  };
}
