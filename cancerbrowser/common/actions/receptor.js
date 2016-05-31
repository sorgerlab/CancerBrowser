import api from '../api';

export const SET_RECEPTORS = 'SET_RECEPTORS';
export const REQUEST_RECEPTORS = 'REQUEST_RECEPTORS';

/**
 * Action creator for setting receptors
 */
function setReceptors(receptors) {
  return {
    type: SET_RECEPTORS,
    receptors
  };
}

/**
 * Action creator for setting receptors
 */
function requestReceptors() {
  return {
    type: REQUEST_RECEPTORS
  };
}


/**
 * Helper function to get receptors
 * @return {Function}
 */
function fetchReceptors() {
  return dispatch => {
    dispatch(requestReceptors());
    api.getReceptors()
    .then((data) => dispatch(setReceptors(data)));
  };
}

/**
 * Helper function to determine if the
 * receptors need to be acquired.
 */
function shouldFetchReceptors(state) {
  const { receptors } = state;

  // If there are no receptors at all
  if (!receptors) {
    return true;
  }

  if (receptors.items && receptors.items.length > 0) {
    return false;
  }

  // If is already fetching
  if (receptors.isFetching) {
    return false;
  }

  return true;
}

/**
 * Public function to acquire receptors
 * and create action to store it.
 */
export function fetchReceptorsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchReceptors(getState())) {
      return dispatch(fetchReceptors());
    }
  };
}
