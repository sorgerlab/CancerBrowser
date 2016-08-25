import api from '../api';

export const CHANGE_CELL_LINE_VIEW = 'CHANGE_CELL_LINE_VIEW';
export const SET_CELL_LINE_INFO = 'SET_CELL_LINE_INFO';

export const REQUEST_CELL_LINES = 'REQUEST_CELL_LINES';
export const RECEIVE_CELL_LINES = 'RECEIVE_CELL_LINES';

export const CELL_LINES_CHANGE_ACTIVE_FILTERS = 'CELL_LINES_CHANGE_ACTIVE_FILTERS';
export const CELL_LINES_RESET_FILTERS = 'CELL_LINES_RESET_FILTERS';


/**
 * Action creator changing the active filters
 */
export function changeActiveFilters(activeFilters) {
  return {
    type: CELL_LINES_CHANGE_ACTIVE_FILTERS,
    activeFilters
  };
}

/**
 * Action creator for resetting active filtesr
 */
export function resetActiveFilters() {
  return {
    type: CELL_LINES_RESET_FILTERS
  };
}


/**
 * Action creator for changing the cell line view the table shows
 * @param {String} cellLineView new cell line view id.
 */
export function changeCellLineView(cellLineView) {
  return {
    type: CHANGE_CELL_LINE_VIEW,
    cellLineView: cellLineView
  };
}

/**
 * Action creator for setting cell line info
 * @param {Object} Cell Line Info
 */
function setCellLineInfo(info) {
  return {
    type: SET_CELL_LINE_INFO,
    info
  };
}

/**
 * Action creator for indicating cell line data has been
 * requested
 */
function requestCellLines() {
  return {
    type: REQUEST_CELL_LINES
  };
}

/**
 * Action creator for setting all cel line data
 * @param {Array} cell lines data array
 */
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
