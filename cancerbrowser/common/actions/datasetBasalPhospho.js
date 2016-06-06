export const DATASET_BASAL_PHOSPHO_CHANGE_ACTIVE_FILTERS = 'DATASET_BASAL_PHOSPHO_CHANGE_ACTIVE_FILTERS';


export function changeActiveFilters(activeFilters) {
  return {
    type: DATASET_BASAL_PHOSPHO_CHANGE_ACTIVE_FILTERS,
    activeFilters
  };
}
