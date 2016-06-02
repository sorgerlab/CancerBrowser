export const CHANGE_ACTIVE_FILTERS = 'DATASET_RECEPTOR_PROFILE_CHANGE_ACTIVE_FILTERS';
export const CHANGE_VIEW_BY = 'CHANGE_VIEW_BY';

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
