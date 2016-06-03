import api from '../api';

export const SET_FILTERED_CELL_LINES = 'SET_FILTERED_CELL_LINES';
export const CHANGE_CELL_LINE_VIEW = 'CHANGE_CELL_LINE_VIEW';
export const SET_CELL_LINE_COUNTS = 'SET_CELL_LINE_COUNTS';
export const SET_CELL_LINE_INFO = 'SET_CELL_LINE_INFO';


export const REQUEST_CELL_LINES = 'REQUEST_CELL_LINES';
export const RECEIVE_CELL_LINES = 'RECEIVE_CELL_LINES';

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
 * Action creator for setting cell line info
 */
function setCellLineInfo(info) {
  return {
    type: SET_CELL_LINE_INFO,
    info
  };
}



function requestCellLines() {
  return {
    type: REQUEST_CELL_LINES
  };
}

function receiveCellLines(cellLines) {
  return {
    type: RECEIVE_CELL_LINES,
    cellLines
  };
}

/**
 * Helper function to determine if the
 * cell lines need to be acquired.
 * @return {Boolean}
 */
function shouldFetchCellLines(state) {
  const { cellLines } = state;

  // no cell lines state defined
  if (!cellLines) {
    return true;
  }

  // If this cell lines are already being fetched
  if (cellLines.isFetching) {
    return false;
  }

  // If cell lines state exists, but is not populated
  if (!cellLines.items || !cellLines.items.length) {
    return true;
  }

  return false;
}

/**
 * Helper function to get cellines given a set of filterGroups
 * @return {Function}
 */
function fetchCellLines() {
  return dispatch => {
    dispatch(requestCellLines());
    api.getCellLines().then((data) => {
      dispatch(receiveCellLines(data));
      return data;
    });
  };
}

/**
 * Public function to acquire cell line data
 * and create action to store it.
 */
export function fetchCellLinesIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchCellLines(getState())) {
      return dispatch(fetchCellLines());
    }
  };
}

/**
 * Helper function to determine if the
 * cell line info need to be acquired.
 * Right now always returns true.
 * @return true
 */
function shouldFetchCellLineInfo(cellLineId, state) {
  return true;
}

/**
 * Helper function to get cellines given a set of filterGroups
 * @return {Function}
 */
function fetchCellLineInfo(cellLineId) {
  return dispatch => {
    api.getCellLineInfo(cellLineId)
    .then((data) => dispatch(setCellLineInfo(data)) );
  };
}

/**
 * Public function to acquire cell line data
 * and create action to store it.
 */
export function fetchCellLineInfoIfNeeded(cellLineId) {
  return (dispatch, getState) => {
    if (shouldFetchCellLineInfo(cellLineId, getState())) {
      return dispatch(fetchCellLineInfo(cellLineId));
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
