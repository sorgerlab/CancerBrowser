import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import combinedReducers from '../reducers';
import analyticsMiddleware from './analytics_middleware';
import { enableBatching } from 'redux-batched-actions';

export default function configureStore(browserHistory, initialState = undefined) {
  const store = createStore(
    enableBatching(combinedReducers),
    initialState,
    compose(
      applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
        routerMiddleware(browserHistory),
        analyticsMiddleware
      ),
      (window.devToolsExtension) ? window.devToolsExtension() : f => f
    )
  );
  return store;
}
