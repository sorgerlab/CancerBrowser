// TODO I am unsure why import of React is required here as it is not used
// directly
import React from 'react';

import { Route, IndexRoute } from 'react-router';

import App from '../containers/App';
import CellLineBrowserPage from '../containers/CellLineBrowserPage';
import CubeBrowserPage from '../containers/CubeBrowserPage';
import DatasetDetailPage from '../containers/DatasetDetailPage';

import Home from '../components/Home';
import About from '../components/About';
import CellLineDetail from '../components/CellLineDetail';
import List from '../components/List';



export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="about" component={About} />
    <Route path="cell" component={CellLineBrowserPage}>
      <IndexRoute component={List} />
      <Route path="Cube" component={CubeBrowserPage} />
      <Route path="detail/:cellId" component={CellLineDetail} />
    </Route>
    <Route path="Dataset/:datasetId" component={DatasetDetailPage} />
  </Route>
);
