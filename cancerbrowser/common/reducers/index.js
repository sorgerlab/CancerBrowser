import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import datasets from './datasets';
import cells from './cells';
import cellsInDatasets from './cellsInDatasets';
import datasetDetail from './datasetDetail';
import cellFilter from './cellFilter';

export default combineReducers({
  datasets,
  cells,
  cellsInDatasets,
  cellFilter,
  datasetDetail,
  routing: routerReducer
});
