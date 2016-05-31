import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import datasets from './datasets';
import cellLines from './cell_lines';
import drugs from './drugs';
import filters from './filters';
import receptors from './receptors';

import datasetDetails from './datasetDetails';

export default combineReducers({
  datasets,
  datasetDetails,
  cellLines,
  drugs,
  filters,
  receptors,
  routing: routerReducer
});
