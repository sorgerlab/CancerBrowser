export const DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_FILTERS = 'DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_FILTERS';
export const DATASET_RECEPTOR_PROFILE_CHANGE_VIEW_BY = 'DATASET_RECEPTOR_PROFILE_CHANGE_VIEW_BY';
export const DATASET_RECEPTOR_PROFILE_CHANGE_HIGHLIGHT = 'DATASET_RECEPTOR_PROFILE_CHANGE_HIGHLIGHT';
export const DATASET_RECEPTOR_PROFILE_CHANGE_TOGGLED = 'DATASET_RECEPTOR_PROFILE_CHANGE_TOGGLED';
export const DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_COLOR_BY = 'DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_COLOR_BY';
export const DATASET_RECEPTOR_PROFILE_CHANGE_SIDE = 'DATASET_RECEPTOR_PROFILE_CHANGE_SIDE';
export const DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_SORT_BY = 'DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_SORT_BY';
export const DATASET_RECEPTOR_PROFILE_CHANGE_CELL_LINE_SORT_BY = 'DATASET_RECEPTOR_PROFILE_CHANGE_CELL_LINE_SORT_BY';



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

export function changeToggled(toggledId) {
  return {
    type: DATASET_RECEPTOR_PROFILE_CHANGE_TOGGLED,
    toggledId
  };
}

export function changeSide(side) {
  return {
    type: DATASET_RECEPTOR_PROFILE_CHANGE_SIDE,
    side
  };
}

export function changeCellLineSortBy(cellLineSortBy) {
  return {
    type: DATASET_RECEPTOR_PROFILE_CHANGE_CELL_LINE_SORT_BY,
    cellLineSortBy
  };
}

export function changeReceptorSortBy(receptorSortBy) {
  return {
    type: DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_SORT_BY,
    receptorSortBy
  };
}
