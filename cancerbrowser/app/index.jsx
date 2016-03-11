import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk'
import datasets from './reducers/datasets';
import cells from './reducers/cells';
import cellsInDatasets from './reducers/cellsInDatasets';
import datasetDetail from './reducers/datasetDetail';
import cellFilter from './reducers/cellFilter';
import CancerBrowser from './CancerBrowser';
import Home from './Home';
import About from './About';
import Cell from './Cell';
import CellDetail from './CellDetail';
import Protein from './Protein';
import Ligand from './Ligand';
import Molecule from './Molecule';
import Cube from './Cube';
import List from './List';
import DatasetDetail from './DatasetDetail';

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
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={CancerBrowser}>
        <IndexRoute component={Home} />
        <Route path="about" component={About} />
        <Route path="cell" component={Cell}>
          <IndexRoute component={List} />
          <Route path="Cube" component={Cube} />
          <Route path="detail/:cellId" component={CellDetail} />
        </Route>
        <Route path="protein" component={Protein} />
        <Route path="molecule" component={Molecule} />
        <Route path="ligand" component={Ligand} />
        <Route path="Dataset/:datasetId" component={DatasetDetail} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('cancerBrowser'))
