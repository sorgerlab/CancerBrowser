import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { Router, browserHistory, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

// import Immutable from 'immutable';

import configureStore from '../common/utils/configureStore';
// import { ProductState, ProductRecord, CartState, convertMapToImmutable } from '../common/constants/Types';
import routes from '../common/routes';

// Enable/Disable Redux Devtools
window.$REDUX_DEVTOOL = false;

let state = undefined;
if ( window.$REDUX_STATE ) {

  // Assign the prerendered state
	state = window.$REDUX_STATE;

	// begin marshalling data into Immutable types
	// state.products = new ProductState( {
	// 	$fetched: document.location.pathname == '/',
	// 	productsById: convertMapToImmutable( state.products.productsById, ProductRecord ),
	// 	total: state.products.total,
	// } );
  //
	// state.carts = new CartState( {
	// 	cartsById: Immutable.List.of( ...state.carts.cartsById ),
	// } );

	// console.log( 'server-rendering state restored: ', state );
}

// TODO configureStore
const store = configureStore(state);
// TODO I'm not sure if this is the right place to do this. Maybe should be in
// configureStore
const history = syncHistoryWithStore(hashHistory, store);

// Watch routing in console
// history.listen(location => console.log(location.pathname));

ReactDOM.render(
  (
    <Provider store={ store }>
      <Router history={ history } routes={ routes }/>
    </Provider>
  ),
  document.getElementById('cancerBrowser')
)
