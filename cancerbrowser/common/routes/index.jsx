// TODO I am unsure why import of React is required here as it is not used
// directly
import React from 'react'

import { Route, IndexRoute } from 'react-router';

import CancerBrowser from '../CancerBrowser';
import Home from '../Home';
import About from '../About';
import Cell from '../Cell';
import CellDetail from '../CellDetail';
import Protein from '../Protein';
import Ligand from '../Ligand';
import Molecule from '../Molecule';
import Cube from '../Cube';
import List from '../List';
import DatasetDetail from '../DatasetDetail';

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
