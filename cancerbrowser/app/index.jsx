import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import CancerBrowser from './CancerBrowser';
import Home from './Home';
import About from './About';
import Cell from './Cell';
import Protein from './Protein';
import Ligand from './Ligand';
import Molecule from './Molecule';

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={CancerBrowser}>
      <IndexRoute component={Home} />
      <Route path="about" component={About} />
      <Route path="cell" component={Cell} />
      <Route path="protein" component={Protein} />
      <Route path="molecule" component={Molecule} />
      <Route path="ligand" component={Ligand} />
    </Route>
  </Router>
), document.getElementById('cancerBrowser'))
