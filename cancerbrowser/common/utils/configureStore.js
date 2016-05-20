import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
// import createLogger from 'redux-logger';
import combinedReducers from '../reducers';

// import { devTools, persistState } from 'redux-devtools';

// redux devtools
// let _createStore;
// if ( window.$REDUX_DEVTOOL ) {
// 	_createStore = compose( devTools(), createStore );
// }else {
// 	_createStore = createStore;
// }
let _createStore = createStore;

// Logger
// const logger = createLogger({
//   level: 'info',
//   collapsed: true,
//   // predicate: (getState, action) => action.type !== AUTH_REMOVE_TOKEN
// });

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
  // logger,
)(_createStore);

export default function configureStore( initialState = undefined  ) {

	// Server Rendering
  const store = createStoreWithMiddleware( combinedReducers, initialState );

  // Hot Loading
  // // function(module, exports, __webpack_require__) {
  // if (module.hot) {
  //   // Enable Webpack hot module replacement for reducers
  //   module.hot.accept('../reducers', () => {
  //     const nextRootReducer = require('../reducers');
  //     store.replaceReducer(nextRootReducer);
  //   });
  // }

  return store;
}
