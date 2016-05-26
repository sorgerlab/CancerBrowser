import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import combinedReducers from '../reducers';


export default function configureStore(initialState = undefined) {
  const store = createStore(
    combinedReducers,
    initialState,
    compose(
      applyMiddleware(
        thunkMiddleware // lets us dispatch() functions
      ),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );
  return store;
}
