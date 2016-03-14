import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk'
import datasets from './reducers/datasets';
import cells from './reducers/cells';
import cellsInDatasets from './reducers/cellsInDatasets';
import datasetDetail from './reducers/datasetDetail';
import cellFilter from './reducers/cellFilter';

import routes from './routes';

const store = createStore(
  combineReducers({
    datasets,
    cells,
    cellsInDatasets,
    cellFilter,
    datasetDetail,
    routing: routerReducer
  }),
  undefined,
  applyMiddleware(
    thunkMiddleware
  )
);

const history = syncHistoryWithStore(hashHistory, store);

// Watch routing in console
// history.listen(location => console.log(location.pathname));

ReactDOM.render((
  <Provider store={ store }>
    <Router history={ history } routes={ routes }/>
  </Provider>
), document.getElementById('cancerBrowser'))
