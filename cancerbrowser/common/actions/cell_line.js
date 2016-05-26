import api from '../api';

export const SET_FILTERED_CELL_LINES = 'SET_FILTERED_CELL_LINES';
export const CHANGE_CELL_LINE_VIEW = 'CHANGE_CELL_LINE_VIEW';
export const SET_CELL_LINE_COUNTS = 'SET_CELL_LINE_COUNTS';

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
 * Action creator for setting filtered cell lines
 */
function setCellLineCounts(counts) {
  return {
    type: SET_CELL_LINE_COUNTS,
    counts: counts
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
function fetchCellLines(filterGroups, allFilterGroups) {
  return dispatch => {
    api.getCellLines(filterGroups)
    .then((data) => {
      dispatch(setFilteredCellLines(data));
      return data;
    })
    //TODO: should this be split into 2 different action creators?
    .then(data => api.getCellLineCounts(data, allFilterGroups))
    .then(counts => dispatch(setCellLineCounts(counts)));
  };
}

/**
 * Public function to acquire cell line data
 * and create action to store it.
 */
export function fetchCellLinesIfNeeded(activeFilterGroups, allFilterGroups) {
  return (dispatch, getState) => {
    if (shouldFetchCellLines(getState())) {
      return dispatch(fetchCellLines(activeFilterGroups, allFilterGroups));
    }
  };
}


/**
 * Action creator for changing the cell line view the table shows
 */
export function changeCellLineView(cellLineView) {
  return {
    type: CHANGE_CELL_LINE_VIEW,
    cellLineView: cellLineView
  };
}
