import { CHANGE_CELL_FILTER, CHANGE_CELL_SUBTYPE_FILTER } from '../actions';

export default function cellFilter(state = {
  cell: undefined,
  subtype: undefined
}, action) {
  switch (action.type) {
    case CHANGE_CELL_FILTER:
      return Object.assign({}, state, {
        cell: action.cell
      });
      case CHANGE_CELL_SUBTYPE_FILTER:
        return Object.assign({}, state, {
          subtype: action.subtype,
          cell: undefined
        });
    default:
      return state;
  }
}
