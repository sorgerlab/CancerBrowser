export const CHANGE_ACTIVE_FILTERS = 'DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_FILTERS';
export const CHANGE_VIEW_BY = 'DATASET_RECEPTOR_PROFILE_CHANGE_VIEW_BY';
export const CHANGE_HIGHLIGHT = 'DATASET_RECEPTOR_PROFILE_CHANGE_HIGHLIGHT';
export const CHANGE_ACTIVE_LEFT = 'DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_LEFT';
export const CHANGE_ACTIVE_RIGHT = 'DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_RIGHT';

export function changeActiveFilters(activeFilters) {
  return {
    type: CHANGE_ACTIVE_FILTERS,
    activeFilters
  };
}

export function changeViewBy(viewBy) {
  return {
    type: CHANGE_VIEW_BY,
    viewBy
  };
}


export function changeHighlight(highlightId) {
  return {
    type: CHANGE_HIGHLIGHT,
    highlightId
  };
}

export function changeActiveLeft(activeId) {
  return {
    type: CHANGE_ACTIVE_LEFT,
    activeId
  };
}

export function changeActiveRight(activeId) {
  return {
    type: CHANGE_ACTIVE_RIGHT,
    activeId
  };
}
