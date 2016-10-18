import { LOCATION_CHANGE } from 'react-router-redux';
import ga from 'ga-react-router'

// Middleware to trigger async actions based on the route that is currently being loaded.
export default store => next => action => {

  if (
    action.type === LOCATION_CHANGE
  ) {
    const prevState = store.getState();
    const prevLocation = prevState.routing.locationBeforeTransitions;
    const location = action.payload;
    const prevPath = prevLocation ? prevLocation.pathname : null;
    const path = location.pathname;
    // Only send a pageview if the user actually navigated to a different page
    // and didn't just change the query string via filter changes.
    if (path !== prevPath) {
      ga('set', 'page', path);
      ga('send', 'pageview');
    }
  }

  return next(action);
};

