export const CHANGE_ACTIVE_FILTERS = 'DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_FILTERS';

export function changeActiveFilters(activeFilters) {
  return {
    type: CHANGE_ACTIVE_FILTERS,
    activeFilters
  };
}
