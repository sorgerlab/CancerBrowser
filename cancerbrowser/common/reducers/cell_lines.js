
import {
  CELL_LINES_CHANGE_ACTIVE_FILTERS,
  CELL_LINES_RESET_FILTERS,

  RECEIVE_CELL_LINES,
  REQUEST_CELL_LINES,

  CHANGE_CELL_LINE_VIEW,
  SET_CELL_LINE_INFO } from '../actions/cell_line';

const INITIAL_STATE = {
  isFetching: false,
  items: [],
  activeFilters: {},

  info: {}
};

function cellLines(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CELL_LINES_CHANGE_ACTIVE_FILTERS:
      return Object.assign({}, state, {
        activeFilters: action.activeFilters
      });

    case CELL_LINES_RESET_FILTERS:
      return Object.assign({}, state, {
        activeFilters: INITIAL_STATE.activeFilters
      });
    case REQUEST_CELL_LINES:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_CELL_LINES:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.cellLines
      });

    case CHANGE_CELL_LINE_VIEW:
      return Object.assign({}, state, {
        cellLineView: action.cellLineView
      });

    // case SET_CELL_LINE_INFO:
    //   return Object.assign({}, state, {
    //     info: action.info
    //   });

    default:
      return state;
  }
}

export default cellLines;
