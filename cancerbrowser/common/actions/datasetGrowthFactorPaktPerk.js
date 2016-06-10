export const DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_ACTIVE_FILTERS = 'DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_ACTIVE_FILTERS';
export const DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_VIEW_BY = 'DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_VIEW_BY';
export const DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_HIGHLIGHTED_CELL_LINE = 'DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_HIGHLIGHTED_CELL_LINE';
export const DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_TOGGLED_CELL_LINE = 'DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_TOGGLED_CELL_LINE';
export const DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_GROWTH_FACTOR_COLOR_BY = 'DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_GROWTH_FACTOR_COLOR_BY';
export const DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_GROWTH_FACTOR_SORT_BY = 'DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_GROWTH_FACTOR_SORT_BY';
export const DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_HIGHLIGHTED_GROWTH_FACTOR = 'DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_HIGHLIGHTED_GROWTH_FACTOR';
export const DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_TOGGLED_GROWTH_FACTOR = 'DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_TOGGLED_GROWTH_FACTOR';
export const DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_CELL_LINE_COLOR_BY = 'DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_CELL_LINE_COLOR_BY';
export const DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_CELL_LINE_SORT_BY = 'DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_CELL_LINE_SORT_BY';

/**
 * Action creator to modify the active filters for the
 * dataset growth factor page
 * @param {Object} activeFilters new filters of page
 */
export function changeActiveFilters(activeFilters) {
  return {
    type: DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_ACTIVE_FILTERS,
    activeFilters
  };
}

/**
 * Action creator to modify the view by setting for the
 * dataset growth factor page
 * @param {String} viewBy View by id
 */
export function changeViewBy(viewBy) {
  return {
    type: DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_VIEW_BY,
    viewBy
  };
}

/**
 * Action creator to modify the highlighted cell line for the
 * dataset growth factor page
 * @param {String} highlightId
 */
export function changeHighlightedCellLine(highlightId) {
  return {
    type: DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_HIGHLIGHTED_CELL_LINE,
    highlightId
  };
}

/**
 * Action creator to modify the toggled cell line for the
 * dataset growth factor page
 * @param {String} toggleId
 */
export function changeToggledCellLine(toggledId) {
  return {
    type: DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_TOGGLED_CELL_LINE,
    toggledId
  };
}


/**
 * Action creator to modify the color by setting of growth factor veiw by for the
 * dataset growth factor page
 * @param {String} growthFactorColorBy
 */
export function changeGrowthFactorColorBy(growthFactorColorBy) {
  return {
    type: DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_GROWTH_FACTOR_COLOR_BY,
    growthFactorColorBy
  };
}

/**
 * Action creator to modify the sort by setting of growth factor veiw by for the
 * dataset growth factor page
 * @param {String} growthFactorSortBy
 */
export function changeGrowthFactorSortBy(growthFactorSortBy) {
  return {
    type: DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_GROWTH_FACTOR_SORT_BY,
    growthFactorSortBy
  };
}


/**
 * Action creator to modify the highlighted growth factor for the
 * dataset growth factor page
 * @param {String} highlightId
 */
export function changeHighlightedGrowthFactor(highlightId) {
  return {
    type: DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_HIGHLIGHTED_GROWTH_FACTOR,
    highlightId
  };
}

/**
 * Action creator to modify the toggled growth factor for the
 * dataset growth factor page
 * @param {String} toggledId
 */
export function changeToggledGrowthFactor(toggledId) {
  return {
    type: DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_TOGGLED_GROWTH_FACTOR,
    toggledId
  };
}

/**
 * Action creator to modify the color by setting of cell line veiw by for the
 * dataset growth factor page
 * @param {String} cellLineColorBy
 */
export function changeCellLineColorBy(cellLineColorBy) {
  return {
    type: DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_CELL_LINE_COLOR_BY,
    cellLineColorBy
  };
}

/**
 * Action creator to modify the sort by setting of cell line veiw by for the
 * dataset growth factor page
 * @param {String} cellLineSortBy
 */
export function changeCellLineSortBy(cellLineSortBy) {
  return {
    type: DATASET_GROWTH_FACTOR_PAKT_PERK_CHANGE_CELL_LINE_SORT_BY,
    cellLineSortBy
  };
}
