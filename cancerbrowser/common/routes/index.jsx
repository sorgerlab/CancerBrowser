// TODO I am unsure why import of React is required here as it is not used
// directly
import React from 'react'

import { Route, IndexRoute } from 'react-router';

import {
  CancerBrowser,
  Home,
  About,
  Cell,
  CellDetail,
  Protein,
  Ligand,
  Molecule,
  Cube,
  List,
  DatasetDetail
 } from '../components';

export default (
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
);
