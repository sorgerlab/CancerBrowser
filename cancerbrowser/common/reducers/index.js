import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import datasets from './datasets';
import cellLines from './cell_lines';
import drugs from './drugs';

export default combineReducers({
  datasets,
  cellLines,
  drugs,
  routing: routerReducer
});
