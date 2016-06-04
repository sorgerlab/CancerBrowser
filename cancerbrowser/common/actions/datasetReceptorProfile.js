export const DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_FILTERS = 'DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_FILTERS';
export const DATASET_RECEPTOR_PROFILE_CHANGE_VIEW_BY = 'DATASET_RECEPTOR_PROFILE_CHANGE_VIEW_BY';
export const DATASET_RECEPTOR_PROFILE_CHANGE_HIGHLIGHT = 'DATASET_RECEPTOR_PROFILE_CHANGE_HIGHLIGHT';
export const DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_COLOR_BY = 'DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_COLOR_BY';

export const DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_LEFT = 'DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_LEFT';
export const DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_RIGHT = 'DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_RIGHT';


export function changeActiveFilters(activeFilters) {
  return {
    type: DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_FILTERS,
    activeFilters
  };
}

export function changeViewBy(viewBy) {
  return {
    type: DATASET_RECEPTOR_PROFILE_CHANGE_VIEW_BY,
    viewBy
  };
}

export function changeReceptorColorBy(colorBy) {
  return {
    type: DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_COLOR_BY,
    colorBy
  };
}

export function changeHighlight(highlightId) {
  return {
    type: DATASET_RECEPTOR_PROFILE_CHANGE_HIGHLIGHT,
    highlightId
  };
}

export function changeActiveLeft(activeId) {
  return {
    type: DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_LEFT,
    activeId
  };
}

export function changeActiveRight(activeId) {
  return {
    type: DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_RIGHT,
    activeId
  };
}
