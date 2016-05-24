import api from '../api';

export const SET_FILTERED_CELL_LINES = 'SET_FILTERED_CELL_LINES';

/**
 * Action creator for setting filtered cell lines
 */
function setFilteredCellLines(cellLines) {
  return {
    type: SET_FILTERED_CELL_LINES,
    cellLines: cellLines
  };
}

/**
 * Helper function to determine if the
 * cell lines need to be acquired.
 * Right now always returns true.
 * @return true
 */
function shouldFetchCellLines(state) {
  return true;
}

/**
 * Helper function to get cellines given a set of filterGroups
 * @return {Function}
 */
function fetchCellLines(filterGroups) {
  return dispatch => {
    api.getCellLines(filterGroups).then(
      json => dispatch(setFilteredCellLines(json))
    );
  };
}

/**
 * Public function to acquire cell line data
 * and create action to store it.
 */
export function fetchCellLinesIfNeeded(filterGroups) {
  return (dispatch, getState) => {
    if (shouldFetchCellLines(getState())) {
      return dispatch(fetchCellLines(filterGroups));
    }
  };
}
