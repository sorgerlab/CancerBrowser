import React from 'react';

import { Route, IndexRoute } from 'react-router';

import App from '../containers/App';

import CellLineBrowserPage from '../containers/CellLineBrowserPage';
import CellLineDetailPage from '../containers/CellLineDetailPage';

import DrugBrowserPage from '../containers/DrugBrowserPage';
import DrugDetailPage from '../containers/DrugDetailPage';

import DatasetDetailPage from '../containers/DatasetDetailPage';
import DatasetSummaryPage from '../containers/DatasetSummaryPage';

import HomePage from '../containers/HomePage';
import About from '../components/About';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="cell_lines" component={CellLineBrowserPage} />
    <Route path="/cell_line/:cellLineId" component={CellLineDetailPage} />
    <Route path="/drugs" component={DrugBrowserPage} />
    <Route path="/drug/:drugId" component={DrugDetailPage} />
    <Route path="datasets" component={DatasetSummaryPage} />
    <Route path="/dataset/:datasetId" component={DatasetDetailPage} />
    <Route path="about" component={About} />
  </Route>
);
