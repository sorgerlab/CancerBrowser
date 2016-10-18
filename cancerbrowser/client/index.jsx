import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { Router, browserHistory, applyRouterMiddleware } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { useScroll } from 'react-router-scroll';

import configureStore from '../common/utils/configureStore';
import routes from '../common/routes';

import '../common/assets/base.scss';
import 'react-select/dist/react-select.css';

// add in performance tooling in dev
if (process.env.NODE_ENV !== 'production') {
  window.Perf = require('react-addons-perf');
}

let state = undefined;
if ( window.$REDUX_STATE ) {
  // Assign the prerendered state
  state = window.$REDUX_STATE;
}

const store = configureStore(browserHistory, state);
const history = syncHistoryWithStore(browserHistory, store);

// Watch routing in console
// history.listen(location => console.log(location.pathname));

ReactDOM.render(
  (
    <Provider store={ store }>
      <Router history={ history } routes={ routes } render={ applyRouterMiddleware(useScroll()) }/>
    </Provider>
  ),
  document.getElementById('cancer-browser')
);
