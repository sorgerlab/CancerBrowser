import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import datasets from './datasets';
import cellLines from './cell_lines';
import drugs from './drugs';
import filters from './filters';
import receptors from './receptors';

export default combineReducers({
  datasets,
  cellLines,
  drugs,
  filters,
  receptors,
  routing: routerReducer
});
