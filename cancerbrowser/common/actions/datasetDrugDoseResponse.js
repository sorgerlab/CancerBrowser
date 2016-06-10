export const DATASET_DRUG_DOSE_RESPONSE_CHANGE_ACTIVE_FILTERS = 'DATASET_DRUG_DOSE_RESPONSE_CHANGE_ACTIVE_FILTERS';
export const DATASET_DRUG_DOSE_RESPONSE_CHANGE_VIEW_BY = 'DATASET_DRUG_DOSE_RESPONSE_CHANGE_VIEW_BY';
export const DATASET_DRUG_DOSE_RESPONSE_CHANGE_HIGHLIGHTED_CELL_LINE = 'DATASET_DRUG_DOSE_RESPONSE_CHANGE_HIGHLIGHTED_CELL_LINE';
export const DATASET_DRUG_DOSE_RESPONSE_CHANGE_TOGGLED_CELL_LINE = 'DATASET_DRUG_DOSE_RESPONSE_CHANGE_TOGGLED_CELL_LINE';
export const DATASET_DRUG_DOSE_RESPONSE_CHANGE_DRUG_COLOR_BY = 'DATASET_DRUG_DOSE_RESPONSE_CHANGE_DRUG_COLOR_BY';
export const DATASET_DRUG_DOSE_RESPONSE_CHANGE_DRUG_SORT_BY = 'DATASET_DRUG_DOSE_RESPONSE_CHANGE_DRUG_SORT_BY';
export const DATASET_DRUG_DOSE_RESPONSE_CHANGE_HIGHLIGHTED_DRUG = 'DATASET_DRUG_DOSE_RESPONSE_CHANGE_HIGHLIGHTED_DRUG';
export const DATASET_DRUG_DOSE_RESPONSE_CHANGE_TOGGLED_DRUG = 'DATASET_DRUG_DOSE_RESPONSE_CHANGE_TOGGLED_DRUG';
export const DATASET_DRUG_DOSE_RESPONSE_CHANGE_CELL_LINE_COLOR_BY = 'DATASET_DRUG_DOSE_RESPONSE_CHANGE_CELL_LINE_COLOR_BY';
export const DATASET_DRUG_DOSE_RESPONSE_CHANGE_CELL_LINE_SORT_BY = 'DATASET_DRUG_DOSE_RESPONSE_CHANGE_CELL_LINE_SORT_BY';

/**
 * Action creator to modify the active filters for
 * dataset drug dose page
 * @param {Object} activeFilters new filters of page
 */
export function changeActiveFilters(activeFilters) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_ACTIVE_FILTERS,
    activeFilters
  };
}

/**
 * Action creator to modify the view by setting for the
 * dataset drug dose page
 * @param {String} viewBy View by id
 */
export function changeViewBy(viewBy) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_VIEW_BY,
    viewBy
  };
}

/**
 * Action creator to modify the highlighted entity for the
 * dataset drug dose page
 * @param {String} highlightedId
 */
export function changeHighlightedCellLine(highlightId) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_HIGHLIGHTED_CELL_LINE,
    highlightId
  };
}

/**
 * Action creator to modify cell line toggle on the
 * dataset drug dose page
 * @param {String} toggleId
 */
export function changeToggledCellLine(toggledId) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_TOGGLED_CELL_LINE,
    toggledId
  };
}


/**
 * Action creator to modify the color setting by drug on the
 * dataset drug dose page
 * @param {String} drugColorBy
 */
export function changeDrugColorBy(drugColorBy) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_DRUG_COLOR_BY,
    drugColorBy
  };
}

/**
 * Action creator to modify the sort setting by drug on the
 * dataset drug dose page
 * @param {String} drugSortBy
 */
export function changeDrugSortBy(drugSortBy) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_DRUG_SORT_BY,
    drugSortBy
  };
}


/**
 * Action creator to modify the highlighted drug for the
 * dataset drug dose page
 * @param {String} highlightId
 */
export function changeHighlightedDrug(highlightId) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_HIGHLIGHTED_DRUG,
    highlightId
  };
}

/**
 * Action creator to modify drug toggle on the
 * dataset drug dose page
 * @param {String} toggleId
 */
export function changeToggledDrug(toggledId) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_TOGGLED_DRUG,
    toggledId
  };
}

/**
 * Action creator to modify the color setting by cell line on the
 * dataset drug dose page
 * @param {String} drugColorBy
 */
export function changeCellLineColorBy(cellLineColorBy) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_CELL_LINE_COLOR_BY,
    cellLineColorBy
  };
}

/**
 * Action creator to modify the sort by setting by cell line on the
 * dataset drug dose page
 * @param {String} drugColorBy
 */
export function changeCellLineSortBy(cellLineSortBy) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_CELL_LINE_SORT_BY,
    cellLineSortBy
  };
}
