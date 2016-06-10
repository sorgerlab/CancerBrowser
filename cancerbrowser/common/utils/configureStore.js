import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import combinedReducers from '../reducers';
import { enableBatching } from 'redux-batched-actions';

export default function configureStore(initialState = undefined) {
  const store = createStore(
    enableBatching(combinedReducers),
    initialState,
    compose(
      applyMiddleware(
        thunkMiddleware // lets us dispatch() functions
      ),
      (window.devToolsExtension) ? window.devToolsExtension() : f => f
    )
  );
  return store;
}
