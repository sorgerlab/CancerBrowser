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

export function changeActiveFilters(activeFilters) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_ACTIVE_FILTERS,
    activeFilters
  };
}

export function changeViewBy(viewBy) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_VIEW_BY,
    viewBy
  };
}

export function changeHighlightedCellLine(highlightId) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_HIGHLIGHTED_CELL_LINE,
    highlightId
  };
}

export function changeToggledCellLine(toggledId) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_TOGGLED_CELL_LINE,
    toggledId
  };
}


export function changeDrugColorBy(drugColorBy) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_DRUG_COLOR_BY,
    drugColorBy
  };
}

export function changeDrugSortBy(drugSortBy) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_DRUG_SORT_BY,
    drugSortBy
  };
}


export function changeHighlightedDrug(highlightId) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_HIGHLIGHTED_DRUG,
    highlightId
  };
}

export function changeToggledDrug(toggledId) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_TOGGLED_DRUG,
    toggledId
  };
}

export function changeCellLineColorBy(cellLineColorBy) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_CELL_LINE_COLOR_BY,
    cellLineColorBy
  };
}

export function changeCellLineSortBy(cellLineSortBy) {
  return {
    type: DATASET_DRUG_DOSE_RESPONSE_CHANGE_CELL_LINE_SORT_BY,
    cellLineSortBy
  };
}
