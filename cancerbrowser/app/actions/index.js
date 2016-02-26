import fetch from 'isomorphic-fetch';

export const REQUEST_DATASETS = 'REQUEST_DATASETS';
export const RECEIVE_DATASETS = 'RECEIVE_DATASETS';

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
  console.log(state.datasets.items);
  if (!datasets.items) {
    return true
  } else if (datasets.isFetching) {
    return false
  }
}

export function fetchDatasetsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchDatasets(getState())) {
      return dispatch(fetchDatasets());
    }
  }
}
