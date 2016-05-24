import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import datasets from './datasets';
import cells from './cells';
import cellLines from './cell_lines';
import filters from './filters';

import cellsInDatasets from './cellsInDatasets';
import datasetDetails from './datasetDetails';
import cellFilter from './cellFilter';

export default combineReducers({
  datasets,
  cells,
  cellsInDatasets,
  cellFilter,
  datasetDetails,
  cellLines,
  filters,
  routing: routerReducer
});
