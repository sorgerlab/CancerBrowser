
import {
  SET_FILTERED_CELL_LINES,
  CHANGE_CELL_LINE_VIEW,
  SET_CELL_LINE_COUNTS,
  SET_CELL_LINE_INFO } from '../actions/cell_line';

const INITIAL_STATE = {
  filtered: [],
  isFetching: false,
  counts: {},
  info: {}
};

function cellLines(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_FILTERED_CELL_LINES:
      return Object.assign({}, state, {
        isFetching: false,
        filtered: action.cellLines
      });

    case CHANGE_CELL_LINE_VIEW:
      return Object.assign({}, state, {
        cellLineView: action.cellLineView
      });

    case SET_CELL_LINE_COUNTS:
      return Object.assign({}, state, {
        counts: action.counts
      });

    case SET_CELL_LINE_INFO:
      return Object.assign({}, state, {
        info: action.info
      });

    default:
      return state;
  }
}

export default cellLines;
