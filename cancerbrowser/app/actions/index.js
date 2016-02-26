import fetch from 'isomorphic-fetch';

export const REQUEST_DATASETS = 'REQUEST_DATASETS';
export const RECEIVE_DATASETS = 'RECEIVE_DATASETS';
export const REQUEST_CELLS = 'REQUEST_CELLS';
export const RECEIVE_CELLS = 'RECEIVE_CELLS';

// Actions
function requestDatasets() {
  return {
    type: REQUEST_DATASETS
  }
}

function receiveDatasets(json) {
  return {
    type: RECEIVE_DATASETS,
    datasets: json.datasets
  }
}

function requestCells() {
  return {
    type: REQUEST_CELLS
  }
}

function receiveCells(json) {
  return {
    type: RECEIVE_CELLS,
    cells: json.cells
  }
}

// Helpers
function fetchDatasets() {
  return dispatch => {
    dispatch(requestDatasets())
    return fetch('http://localhost:8080/sampledata/datasets.json')
      .then(req => req.json())
      .then(json => dispatch(receiveDatasets(json)))
  }
}

function shouldFetchDatasets(state) {
  const datasets = state.datasets;

  if (!datasets.items) {
    return true
  } else if (datasets.isFetching) {
    return false
  }
  return false;
}

function fetchCells() {
  return dispatch => {
    dispatch(requestCells())
    return fetch('http://localhost:8080/sampledata/cells.json')
      .then(req => req.json())
      .then(json => dispatch(receiveCells(json)))
  }
}

function shouldFetchCells(state) {
  const cells = state.cells;

  if (!cells.items) {
    return true
  } else if (cells.isFetching) {
    return false
  }
  return false;
}

// Action Creators (Functions when using thunk)
export function fetchDatasetsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchDatasets(getState())) {
      return dispatch(fetchDatasets());
    }
  }
}

export function fetchCellsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchCells(getState())) {
      return dispatch(fetchCells());
    }
  }
}
