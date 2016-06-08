import {
  DATASET_DRUG_DOSE_RESPONSE_CHANGE_ACTIVE_FILTERS,
  DATASET_DRUG_DOSE_RESPONSE_CHANGE_VIEW_BY,
  DATASET_DRUG_DOSE_RESPONSE_CHANGE_HIGHLIGHTED_CELL_LINE,
  DATASET_DRUG_DOSE_RESPONSE_CHANGE_TOGGLED_CELL_LINE,
  DATASET_DRUG_DOSE_RESPONSE_CHANGE_DRUG_COLOR_BY,
  DATASET_DRUG_DOSE_RESPONSE_CHANGE_DRUG_SORT_BY,
  DATASET_DRUG_DOSE_RESPONSE_CHANGE_HIGHLIGHTED_DRUG,
  DATASET_DRUG_DOSE_RESPONSE_CHANGE_TOGGLED_DRUG,
  DATASET_DRUG_DOSE_RESPONSE_CHANGE_CELL_LINE_COLOR_BY,
  DATASET_DRUG_DOSE_RESPONSE_CHANGE_CELL_LINE_SORT_BY

} from '../actions/datasetDrugDoseResponse';

const INITIAL_STATE = {
  baseFilters: {
    cellLineFilters: [
      { id: 'dataset', values: ['drug_dose_response'] }
    ]
  },

  activeFilters: {
    drugConfig: [
      { id: 'drug', values: ['10001-101'] }
    ],
    cellLineConfig: [
      { id: 'cellLine', values: ['mcf7'] }
    ]
  },

  viewBy: 'drug',

  drugColorBy: 'cellLineReceptorStatus',
  drugSortBy: 'magnitude',
  highlightedCellLine: undefined,
  toggledCellLine: undefined,

  cellLineSortBy: 'magnitude',
  highlightedDrug: undefined,
  toggledDrug: undefined
};

function datasetDrugDoseResponse(state = INITIAL_STATE, action) {
  switch (action.type) {
    case DATASET_DRUG_DOSE_RESPONSE_CHANGE_ACTIVE_FILTERS:
      // reset to the initial state of set to null or undefined
      return Object.assign({}, state, {
        activeFilters: action.activeFilters == null ? INITIAL_STATE.activeFilters : action.activeFilters
      });
    case DATASET_DRUG_DOSE_RESPONSE_CHANGE_VIEW_BY:
      return Object.assign({}, state, {
        viewBy: action.viewBy
      });
    case DATASET_DRUG_DOSE_RESPONSE_CHANGE_DRUG_COLOR_BY:
      return Object.assign({}, state, {
        drugColorBy: action.drugColorBy
      });
    case DATASET_DRUG_DOSE_RESPONSE_CHANGE_DRUG_SORT_BY:
      return Object.assign({}, state, {
        drugSortBy: action.drugSortBy
      });
    case DATASET_DRUG_DOSE_RESPONSE_CHANGE_HIGHLIGHTED_CELL_LINE:
      return Object.assign({}, state, {
        highlightedCellLine: action.highlightId
      });
    case DATASET_DRUG_DOSE_RESPONSE_CHANGE_TOGGLED_CELL_LINE:
      return Object.assign({}, state, {
        toggledCellLine: action.toggledId
      });
    case DATASET_DRUG_DOSE_RESPONSE_CHANGE_CELL_LINE_COLOR_BY:
      return Object.assign({}, state, {
        cellLineColorBy: action.cellLineColorBy
      });
    case DATASET_DRUG_DOSE_RESPONSE_CHANGE_CELL_LINE_SORT_BY:
      return Object.assign({}, state, {
        cellLineSortBy: action.cellLineSortBy
      });
    case DATASET_DRUG_DOSE_RESPONSE_CHANGE_HIGHLIGHTED_DRUG:
      return Object.assign({}, state, {
        highlightedDrug: action.highlightId
      });
    case DATASET_DRUG_DOSE_RESPONSE_CHANGE_TOGGLED_DRUG:
      return Object.assign({}, state, {
        toggledDrug: action.toggledId
      });
    default:
      return state;
  }
}

export default datasetDrugDoseResponse;
