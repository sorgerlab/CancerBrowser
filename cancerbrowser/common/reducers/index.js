import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import datasets from './datasets';
import cells from './cells';
import cellsInDatasets from './cellsInDatasets';
import datasetDetails from './datasetDetails';
import cellFilter from './cellFilter';

export default combineReducers({
  datasets,
  cells,
  cellsInDatasets,
  cellFilter,
  datasetDetails,
  routing: routerReducer
});
