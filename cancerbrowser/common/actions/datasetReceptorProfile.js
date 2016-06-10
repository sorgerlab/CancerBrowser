export const DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_FILTERS = 'DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_FILTERS';
export const DATASET_RECEPTOR_PROFILE_CHANGE_VIEW_BY = 'DATASET_RECEPTOR_PROFILE_CHANGE_VIEW_BY';
export const DATASET_RECEPTOR_PROFILE_CHANGE_HIGHLIGHT = 'DATASET_RECEPTOR_PROFILE_CHANGE_HIGHLIGHT';
export const DATASET_RECEPTOR_PROFILE_CHANGE_TOGGLED = 'DATASET_RECEPTOR_PROFILE_CHANGE_TOGGLED';
export const DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_COLOR_BY = 'DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_COLOR_BY';
export const DATASET_RECEPTOR_PROFILE_CHANGE_SIDE = 'DATASET_RECEPTOR_PROFILE_CHANGE_SIDE';
export const DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_SORT_BY = 'DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_SORT_BY';
export const DATASET_RECEPTOR_PROFILE_CHANGE_CELL_LINE_SORT_BY = 'DATASET_RECEPTOR_PROFILE_CHANGE_CELL_LINE_SORT_BY';


/**
 * Action creator to modify the active filters for the
 * dataset receptor profile page
 * @param {Object} activeFilters new filters of page
 */
export function changeActiveFilters(activeFilters) {
  return {
    type: DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_FILTERS,
    activeFilters
  };
}

/**
 * Action creator to modify the view by setting for the
 * dataset receptor profile page
 * @param {String} viewBy View by id
 */
export function changeViewBy(viewBy) {
  return {
    type: DATASET_RECEPTOR_PROFILE_CHANGE_VIEW_BY,
    viewBy
  };
}

/**
 * Action creator to modify the color by setting of receptor veiw by for the
 * dataset receptor profile page
 * @param {String} growthFactorColorBy
 */
export function changeReceptorColorBy(colorBy) {
  return {
    type: DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_COLOR_BY,
    colorBy
  };
}

/**
 * Action creator to modify the highlighted entity for the
 * dataset receptor profile page
 * @param {String} highlightId
 */
export function changeHighlight(highlightId) {
  return {
    type: DATASET_RECEPTOR_PROFILE_CHANGE_HIGHLIGHT,
    highlightId
  };
}

/**
 * Action creator to modify the toggle setting for the
 * dataset receptor profile page
 * @param {String} toggledId
 */
export function changeToggled(toggledId) {
  return {
    type: DATASET_RECEPTOR_PROFILE_CHANGE_TOGGLED,
    toggledId
  };
}

/**
 * Action creator to modify which side (left/right) is active for the
 * dataset receptor profile page
 * @param {String} side
 */
export function changeSide(side) {
  return {
    type: DATASET_RECEPTOR_PROFILE_CHANGE_SIDE,
    side
  };
}

/**
 * Action creator to modify the sort by setting of cell line veiw by for the
 * dataset receptor profile page
 * @param {String} cellLineSortBy
 */
export function changeCellLineSortBy(cellLineSortBy) {
  return {
    type: DATASET_RECEPTOR_PROFILE_CHANGE_CELL_LINE_SORT_BY,
    cellLineSortBy
  };
}

/**
 * Action creator to modify the sort by setting of receptor veiw by for the
 * dataset receptor profile page
 * @param {String} receptorSortBy
 */
export function changeReceptorSortBy(receptorSortBy) {
  return {
    type: DATASET_RECEPTOR_PROFILE_CHANGE_RECEPTOR_SORT_BY,
    receptorSortBy
  };
}
