
import {
  RECEIVE_CELL_LINES,
  REQUEST_CELL_LINES,

  CHANGE_CELL_LINE_VIEW,
  SET_CELL_LINE_INFO } from '../actions/cell_line';

const INITIAL_STATE = {
  isFetching: false,
  items: [],

  info: {}
};

function cellLines(state = INITIAL_STATE, action) {
  switch (action.type) {
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

    case SET_CELL_LINE_INFO:
      return Object.assign({}, state, {
        info: action.info
      });

    default:
      return state;
  }
}

export default cellLines;
